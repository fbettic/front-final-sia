import React, { useEffect, useState } from "react";
import "./styles.css"
import Robot from '@mui/icons-material/SmartToyOutlined';
import Arrow from '@mui/icons-material/ArrowBackIosNew';
import Occupied from '@mui/icons-material/CancelOutlined';
import Check from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const baseURL = 'http://localhost:8080'

const testingSet = [
	{ id: 1, S1: "1", S2: "-1", S3: "-1", S4: "-1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 2, S1: "1", S2: "-1", S3: "1", S4: "-1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 3, S1: "-1", S2: "1", S3: "1", S4: "-1", ME1: "-1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 4, S1: "-1", S2: "1", S3: "-1", S4: "1", ME1: "-1", ME2: "1", MO1: null, MO2: null, res: null },
	{ id: 5, S1: "1", S2: "1", S3: "1", S4: "1", ME1: "-1", ME2: "-1", MO1: null, MO2: null, res: null },
]

/*
const testingSet = [
	{ id: 1, S1: "1", S2: "-1", S3: "-1", S4: "-1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 2, S1: "1", S2: "-1", S3: "1", S4: "-1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 3, S1: "1", S2: "1", S3: "-1", S4: "-1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 4, S1: "-1", S2: "-1", S3: "-1", S4: "-1", ME1: "1", ME2: "1", MO1: null, MO2: null, res: null },
	{ id: 5, S1: "1", S2: "1", S3: "1", S4: "1", ME1: "-1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 6, S1: "1", S2: "-1", S3: "1", S4: "1", ME1: "1", ME2: "-1", MO1: null, MO2: null, res: null },
	{ id: 7, S1: "1", S2: "1", S3: "-1", S4: "1", ME1: "-1", ME2: "1", MO1: null, MO2: null, res: null },
]*/

const Index = () => {
	const [inProcess, setInProcess] = useState(false)
	const [register, setRegister] = useState([])
	const [lastPattern, setLastPattern] = useState(null)
	const [nextPattern, setNextPattern] = useState(null)
	const [lastId, setLastid] = useState(0)
	const [error, setError] = useState("")
	//const [isBackpropagation, setIsBackpropagation] = useState(false)
	const [isVectorized, setIsVectorized] = useState(true)
	const [change, setChange] = useState(false)
	const [nnData, setNnData] = useState(null)


	const changeNeuralNetwork = async () => {
		setInProcess(true);
		try {
			const response = await fetch(`${baseURL}/changeModel/${isVectorized ? 'p-v' : 'p-nv'}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Accept': '*/*'
				}
			});
			const json = await response.json();

			const newData = {
				...json,
				bias: [json.useBias[0] ? json.bias[0] : 'No', json.useBias[1] ? json.bias[1] : 'No'],
			}

			setNnData(json)
			setLastid(lastId + 1)

		} catch (error) {
			console.error(error);
		}
		setInProcess(false);
		setChange(false)
	}


	const getObstacles = async () => {

		setInProcess(true);
		try {
			const response = await fetch(`${baseURL}/getObstacle`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Accept': '*/*'
				}
			});
			const json = await response.json();

			const newPattern = {
				id: lastId + 1,
				S1: json.Resp.S1,
				S2: json.Resp.S2,
				S3: json.Resp.S3,
				S4: json.Resp.S4,
				MO1: null,
				MO2: null,
				res: null
			}

			setRegister(register.concat([newPattern]))
			setLastid(lastId + 1)

		} catch (error) {
			console.error(error);
		}
		setInProcess(false);
	};


	const processObstacles = async (pattern, set) => {
		setInProcess(true)
		try {

			const sensorValues = {
				S1: pattern.S1,
				S2: pattern.S2,
				S3: pattern.S3,
				S4: pattern.S4
			}

			console.log(sensorValues)

			const response = await fetch(`${baseURL}/processObstacle`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Accept': '*/*'
				},
				body: JSON.stringify(sensorValues)
			});

			const json = await response.json();
			console.log(json)

			if (set === 'live') {


				const newPattern = { ...pattern }
				newPattern.MO1 = json.NNResponse.M1
				newPattern.MO2 = json.NNResponse.M2
				newPattern.res = json.Desc === '' ? '1' : '-1'

				if (json.Desc === '') {
					const nextPattern = {
						id: lastId + 1,
						S1: json.Resp.S1,
						S2: json.Resp.S2,
						S3: json.Resp.S3,
						S4: json.Resp.S4,
						MO1: null,
						MO2: null,
						res: null
					}
					setNextPattern(nextPattern)
				}

				const newRegister = [...register]

				newRegister[newRegister.findIndex(p => p.id === newPattern.id)] = newPattern

				setRegister(newRegister)
				setLastPattern(newPattern)
				setError(json.Desc)
				setLastid(lastId + 1)
			} else {

				pattern.MO1 = json.NNResponse.M1
				pattern.MO2 = json.NNResponse.M2
				pattern.res = json.Desc === '' ? '1' : '-1'

				setLastPattern(pattern)
				setError(json.Desc)
			}


		} catch (error) {
			console.error(error);
		}

		setInProcess(false)
	};

	const handleAdd = () => {
		if (nextPattern !== null) {
			setRegister([...register, nextPattern])
			setNextPattern(null)
		}
	}

	const handleTest = (pattern, set) => {
		setLastPattern(pattern)
		processObstacles(pattern, set);
	}

	const handleStart = () => {
		getObstacles()
	}


	const handleVectorized = (e) => {
		setIsVectorized(!e.target.checked)
		setChange(true)
	}

	const handleChange = () => {
		changeNeuralNetwork()
	}

	const isClear = (sensor) => {
		if (sensor === '1') {
			return <Occupied />
		}
		return <Check />
	}



	const isExpectedResult = (res) => {
		if (res === null) {
			return <span>?</span>
		}

		if (res === '-1') {
			return <Occupied />
		}
		return <Check />
	}

	const getRotation = (motor) => {
		if (motor === null) {
			return <span>?</span>
		}
		return (
			<Arrow className={motor === '1' ? "upArrow" : 'downArrow'} />
		)
	}




	return (
		<>

			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="fixed">
					{lastPattern !== null ?
						<Toolbar className="toolbar">
							<div style={{ marginBottom: '10px' }}>
								<div className="last">
									<div className="headerTitle">
										<span>{inProcess ? 'Processing...' : 'Last Pattern:'}</span>
									</div>


									<div className="headerRow">
										<span>{'{'}</span>
										<span>S1: {lastPattern.S1},</span>
										<span>S2: {lastPattern.S2},</span>
										<span>S3: {lastPattern.S3},</span>
										<span>S4: {lastPattern.S4},</span>
										<span>M1: {lastPattern.MO1 === null ? '-' : lastPattern.MO1},</span>
										<span>M2: {lastPattern.MO2 === null ? '-' : lastPattern.MO2},</span>
										<span>{'}'}</span>
									</div>
									{
										(lastPattern.res !== null && !inProcess) &&
										<div>
											<span>Last Result:</span>
											<div className="headerRow">
												<span>{'{'}</span>
												<span>
													Resp: {error === '' ? ' OK' : ' KO'},
												</span>
												<span>
													Desk: {error === '' ? `'  '` : error}
												</span>
												<span>{'}'}</span>
											</div>
										</div>

									}


								</div>

							</div>
							{
								inProcess &&
								<Box sx={{ width: '98%' }}>
									<LinearProgress />
								</Box>
							}

						</Toolbar> :
						<Toolbar className="toolbar">
							<div className="headerTitle">
								<Robot sx={{ fontSize: '40px' }} />
								<Typography sx={{ fontSize: '30px', marginLeft: '10px' }}>Roberto</Typography>
							</div>

						</Toolbar>
					}
				</AppBar>
			</Box>

			{nnData === null ?
				<Button variant="outlined" size="small" style={{ marginTop: '200px' }} onClick={handleChange}>START</Button>
				:
				<div className="container" style={{ marginTop: lastPattern !== null ? '180px' : '110px' }}>

					<div>
						<Card variant="outlined">
							<CardContent>
								<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
									Neural Network Information
								</Typography>

								<Typography variant="body2" style={{fontFamily: 'Calibri'}}>
									Bias: {nnData.bias.map(elem => elem + " ")} <br/>
									Epochs: {nnData.epochs.map(elem => elem + " ")},<br/>
									initialWeights: |{nnData.initialWeights.map(elem => elem + "|")},<br/>
									learningRate: {nnData.learningRate.map(elem => elem + " ")},<br/>
									test:<br/>
									pv: {JSON.stringify(nnData.tests[0])},<br/>
									pnv: {JSON.stringify(nnData.tests[1])},<br/>
								</Typography>
							</CardContent>
							<CardActions>
								<div style={{ display: 'flex', flexDirection: 'column', padding: '10px 10px' }}>
									<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
										Options
									</Typography>


									<div>
										<FormControlLabel control={<Switch checked={!isVectorized} onChange={handleVectorized} />} label="No Vectorized" />
										<Button variant="outlined" size="small" onClick={handleChange} disabled={!change || inProcess}>apply</Button>
									</div>
								</div>
							</CardActions>
						</Card>
					</div>

					<Accordion style={{ width: '100%' }} defaultExpanded={true}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Testing Set</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<TableContainer>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell >Id</TableCell>
											<TableCell align="center">Sensor1</TableCell>
											<TableCell align="center">Sensor1</TableCell>
											<TableCell align="center">Sensor3</TableCell>
											<TableCell align="center">Sensor4</TableCell>
											<TableCell align="center">Motor1 Esp.</TableCell>
											<TableCell align="center">Motor2 Esp.</TableCell>
											<TableCell align="center">Motor1 Obt.</TableCell>
											<TableCell align="center">Motor2 Obt.</TableCell>
											<TableCell align="center">Resultado</TableCell>
											<TableCell align="center"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{testingSet.sort((a, b) => a.id - b.id).map((row) => (
											<TableRow
												key={row.id}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell align="center">{row.id}</TableCell>
												<TableCell align="center">{isClear(row.S1)}</TableCell>
												<TableCell align="center">{isClear(row.S2)}</TableCell>
												<TableCell align="center">{isClear(row.S3)}</TableCell>
												<TableCell align="center">{isClear(row.S4)}</TableCell>
												<TableCell align="center">{getRotation(row.ME1)}</TableCell>
												<TableCell align="center">{getRotation(row.ME2)}</TableCell>
												<TableCell align="center">{getRotation(row.MO1)}</TableCell>
												<TableCell align="center">{getRotation(row.MO2)}</TableCell>
												<TableCell align="center">{isExpectedResult(row.res)}</TableCell>
												<TableCell align="center"><Button className="btn" variant={'contained'} onClick={() => handleTest(row, 'testing')} disabled={inProcess} >
													<span>Test</span>
												</Button></TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>
					{/* 
				<Accordion style={{ width: '100%' }}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
						
					>
						<Typography>Testing Set</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell >Id</TableCell>
										<TableCell align="center">Sensor1</TableCell>
										<TableCell align="center">Sensor1</TableCell>
										<TableCell align="center">Sensor3</TableCell>
										<TableCell align="center">Sensor4</TableCell>
										<TableCell align="center">Motor1 Esp.</TableCell>
										<TableCell align="center">Motor2 Esp.</TableCell>
										<TableCell align="center">Motor1 Obt.</TableCell>
										<TableCell align="center">Motor2 Obt.</TableCell>
										<TableCell align="center">Resultado</TableCell>
										<TableCell align="center"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{testingSet.sort((a, b) => a.id - b.id).map((row) => (
										<TableRow
											key={row.id}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell align="center">{row.id}</TableCell>
											<TableCell align="center">{isClear(row.S1)}</TableCell>
											<TableCell align="center">{isClear(row.S2)}</TableCell>
											<TableCell align="center">{isClear(row.S3)}</TableCell>
											<TableCell align="center">{isClear(row.S4)}</TableCell>
											<TableCell align="center">{getRotation(row.ME1)}</TableCell>
											<TableCell align="center">{getRotation(row.ME2)}</TableCell>
											<TableCell align="center">{getRotation(row.MO1)}</TableCell>
											<TableCell align="center">{getRotation(row.MO2)}</TableCell>
											<TableCell align="center">{isExpectedResult(row.res)}</TableCell>
											<TableCell align="center"><Button className="btn" variant={'contained'} onClick={() => handleTest(row, 'testing')} disabled={inProcess} >
												<span>Test</span>
											</Button></TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</AccordionDetails>
				</Accordion>
				*/}
					<Accordion style={{ width: '100%' }}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Live Test</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{register.length > 0 ?
								<>
									<div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
										<Button className="btn" variant={'outlined'} onClick={handleAdd} disabled={inProcess || nextPattern === null}>
											<span>Add</span>
										</Button>
									</div>
									<TableContainer>
										<Table sx={{ minWidth: 650 }} aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell >Id</TableCell>
													<TableCell align="center">Sensor1</TableCell>
													<TableCell align="center">Sensor1</TableCell>
													<TableCell align="center">Sensor3</TableCell>
													<TableCell align="center">Sensor4</TableCell>
													<TableCell align="center">Motor1 Obt.</TableCell>
													<TableCell align="center">Motor2 Obt.</TableCell>
													<TableCell align="center">Resultado</TableCell>
													<TableCell align="center"></TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{
													register.sort((a, b) => a.id - b.id).map((row) => (
														<TableRow
															key={row.id}
															sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
														>
															<TableCell align="center">{row.id}</TableCell>
															<TableCell align="center">{isClear(row.S1)}</TableCell>
															<TableCell align="center">{isClear(row.S2)}</TableCell>
															<TableCell align="center">{isClear(row.S3)}</TableCell>
															<TableCell align="center">{isClear(row.S4)}</TableCell>
															<TableCell align="center">{getRotation(row.MO1)}</TableCell>
															<TableCell align="center">{getRotation(row.MO2)}</TableCell>
															<TableCell align="center">{isExpectedResult(row.res)}</TableCell>
															<TableCell align="center"><Button className="btn" variant={'contained'} onClick={() => handleTest(row, 'live')} disabled={inProcess} >
																<span>Run</span>
															</Button></TableCell>
														</TableRow>))}

											</TableBody>
										</Table>
									</TableContainer>
								</>
								:
								<div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
									<Button className="btn" variant={'outlined'} onClick={handleStart} disabled={inProcess}>
										<span>Start</span>
									</Button>
								</div>
							}
						</AccordionDetails>
					</Accordion>

					<div style={{ height: '200px' }}>

					</div>
					{/*

					{
						start &&
						<Button className="btn" variant={'outlined'} onClick={handleStop}>
							<span>Stop</span>
						</Button>
					}

					<Button className="btn" variant={start && next ? 'outlined' : 'contained'} onClick={next ? handleNext : handleStart} disabled={start && !next} >
						<span>{start ? 'Next' : 'Start'}</span>
					</Button>
				*/}

				</div>
			}
		</>
	)
}

export default Index