import React, { useEffect, useState } from "react";
import "./styles.css"
import Robot from '@mui/icons-material/SmartToyOutlined';
import Arrow from '@mui/icons-material/ArrowBackIosNew';
import Occupied from '@mui/icons-material/CancelOutlined';
import Check from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Button } from "@mui/material";


const baseURL = 'http://localhost:8080'

const arrowsInitialState = { up: '40%', down: '40%', right: '40%', left: '40%' }
//const spaceInitialState = { up: true, down: true, right: true, left: true }

const Index = () => {
	const [start, setStart] = useState(false)
	const [next, setNext] = useState(false)
	const [sensors, setSensors] = useState(null)
	const [nextSensors, setNextSensors] = useState(null)
	const [movements, setMovements] = useState(null)
	const [arrows, setArrows] = useState(arrowsInitialState)
	//const [space, setSpace] = useState(spaceInitialState)


	const isClear = (sensor) => {
		if (sensor === '1') {
			return <Occupied sx={{ fontSize: "4rem" }} />
		}
		return <Check sx={{ fontSize: "4rem" }} />
	}

	const handleStart = () => {
		setStart(true);
		setSensors(null);
		setMovements(null);
		getObstacles();
	}

	const handleStop = () => {
		setStart(false)
	}

	const handleNext = () => {
		setMovements(null);
		setSensors(nextSensors);
		processObstacles();
	}

	const handleSensors = (json, next = false) => {
		if (next){
			setNextSensors({
				S1: json.Resp.S1,
				S2: json.Resp.S2,
				S3: json.Resp.S3,
				S4: json.Resp.S4
			})
		}else{
			setSensors({
				S1: json.Resp.S1,
				S2: json.Resp.S2,
				S3: json.Resp.S3,
				S4: json.Resp.S4
			})
		}
	}

	const handleMovements = (json) => {
		setMovements({
			M1: json.Resp.M1,
			M2: json.Resp.M2
		})
	}

	const getObstacles = async () => {
		console.log('get')
		setNext(false);
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
			console.log(json)
			handleSensors(json, false);
			handleSensors(json, true);
			
		} catch (error) {
			console.error(error);
		}
		setNext(true);
	};


	const processObstacles = async () => {
		console.log('process')
		setNext(false)
		try {
			const response = await fetch(`${baseURL}/processObstacle`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Accept': '*/*'
				},
				body: JSON.stringify(nextSensors)
			});
			const json = await response.json();
			console.log(json)
			if (json.Desc === '') {
				handleMovements(json)
				handleSensors(json, true)
			}else{
				console.log('error')
			}
		} catch (error) {
			console.error(error);
		}
		setNext(true)
	};



	useEffect(() => {
		const handleArrows = () => {
			let arrows = { up: '40%', down: '40%', right: '40%', left: '40%' }

			if (movements.M1 === '1' && movements.M2 === '1')
				arrows.up = '100%'
			else if (movements.M1 === '1' && movements.M2 === '-1')
				arrows.right = '100%'
			else if (movements.M1 === '-1' && movements.M2 === '1')
				arrows.left = '100%'
			else if (movements.M1 === '-1' && movements.M2 === '-1')
				arrows.down = '100%'

			setArrows(arrows)
		}

		if (movements !== null) {
			handleArrows()
		} else {
			setArrows(arrowsInitialState)
		}
	}, [movements])


	return (
		<div className="container">
			<div className="row">
				<div className="up">

					<span>{isClear(sensors != null ? sensors.S1 : '-1')}</span>
					<Arrow className="upArrow" sx={{ fontSize: "3rem", opacity: arrows.up }} />
				</div>
			</div>
			<div className="row">
				<div className="left">
					<span>{isClear(sensors != null ? sensors.S4 : '-1')}</span>
					<Arrow sx={{ fontSize: "3rem", opacity: arrows.left }} />
				</div>

				<div className="robot">
					<Robot className="robotIcon" sx={{ fontSize: "8rem" }} />
				</div>

				<div className="right">
					<Arrow className="rightArrow" sx={{ fontSize: "3rem", opacity: arrows.right }} />
					<span>{isClear(sensors != null ? sensors.S2 : '-1')}</span>
				</div>
			</div>
			<div className="row">
				<div className="down">
					<Arrow className="downArrow" sx={{ fontSize: "3rem", opacity: arrows.down }} />
					<span>{isClear(sensors != null ? sensors.S3 : '-1')}</span>
				</div>
			</div>
			<div className="row">
				<div className="data">
					{
						start && 
						<Button className="btn" variant={'outlined'} onClick={handleStop}>
							<span>Stop</span>
						</Button>
					}

					<Button className="btn" variant={start && next ? 'outlined' : 'contained'} onClick={next? handleNext : handleStart} disabled={start && !next} >
						<span>{start ? 'Next' : 'Start'}</span>
					</Button>
				</div>
			</div>
		</div>)
}

export default Index