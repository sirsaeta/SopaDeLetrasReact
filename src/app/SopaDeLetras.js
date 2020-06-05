import React, {Component} from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import axios from 'axios';

const palabraBuscar = 'OIE';

class SopaDeLetras extends Component {
	constructor(props) {
		super(props);

		this.state = {
			form: {
				sopaDeLetras: ""
			},
			sopasDeLetras: null
		};
	}
	
	componentDidMount(){
		axios.get('/assets/resources.json')
		.then((res)=>{
			res.data && res.data.resources &&
			this.setState({sopasDeLetras: res.data.resources});
		}).catch((err)=>{
			console.log(err);
		})
	}

	handleChange = (event) => {
        this.setState({
			form: {
				...this.state.form,
				sopaDeLetras: event.target.value,
			}
        });
    }

	buscarpalabraMatriz(arrayLetras,resultados, limite) {
		let x = 0;
		let y = 0;
		for (let posletra = 0; posletra < limite; posletra++) {
			if (posletra%arrayLetras[x].length===0 && posletra!==0) {
				x++;
				y=0;
			}
			let letra = arrayLetras[x][y].toUpperCase();
			if (letra===palabraBuscar[0].toUpperCase()) {
				resultados = this.busqueda(arrayLetras, resultados,y,x,0,1);
				resultados = this.busqueda(arrayLetras, resultados,y,x,0,-1);
				resultados = this.busqueda(arrayLetras, resultados,y,x,1,0);
				resultados = this.busqueda(arrayLetras, resultados,y,x,-1,0);
				resultados = this.busqueda(arrayLetras, resultados,y,x,1,1);
				resultados = this.busqueda(arrayLetras, resultados,y,x,-1,-1);
				resultados = this.busqueda(arrayLetras, resultados,y,x,-1,1);
				resultados = this.busqueda(arrayLetras, resultados,y,x,-1,1);
			}
			y++;
		}
		return resultados;
	}
	
	busqueda(arrayLetras, resultados, dy, dx, sumx, sumy) {
		let x= dx;
		for (let index = 0; (index < palabraBuscar.length && dy<arrayLetras[x].length  && dx<arrayLetras.length && dx>=0 && dy>=0); index++) {
			let letra = arrayLetras[dx][dy].toUpperCase();
			if (letra === palabraBuscar[index].toUpperCase() && index===2) {
				resultados++;
			}
			else if (letra !== palabraBuscar[index].toUpperCase()) {
				index=palabraBuscar.length;
			}
			dx+=sumx;
			dy+=sumy;
		} 
		return resultados;
	}

	render(){
		let sopa = this.state.form.sopaDeLetras!=='' &&
		this.state.sopasDeLetras[this.state.form.sopaDeLetras];
		let cantidadFilas = sopa && sopa.length; 
		let cantidadColumnas = sopa && sopa[0].length;
		let cantidad = sopa ? this.buscarpalabraMatriz(sopa,0,cantidadFilas*cantidadColumnas) : 0;
	return (
		<div>
			<Grid container >
				<Grid item xs={3} >
					<FormControl fullWidth>
						<InputLabel id="sopa-label">Sopas de Letras</InputLabel>
						<Select
							labelId="sopa-label"
							id="sopas"
							value={this.state.form.sopaDeLetras}
							onChange={this.handleChange}
						>
							{this.state.sopasDeLetras && this.state.sopasDeLetras.map((option,key) => (
								<MenuItem key={key} value={key}>
								{option}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container spacing={2} justify="center" style={{marginTop:'0.5rem'}} >
				{
				sopa &&
				sopa.map((fila,key) => {
					return (
					<Grid key={key} item xs={12} >
						<Grid container spacing={2} justify="center" >
							{
								fila.map((columna,keyc) => {
									return (
									<Grid key={keyc} item xs={1} >
										{columna}
									</Grid>
									)
								})
							}
						</Grid>
					</Grid>
					)
				})
				}
			</Grid>
			<Grid container spacing={2} justify="center" style={{marginTop:'1rem'}} >
				{`Cantidad de veces encontrada la palabra OIE: ${cantidad}`}
			</Grid>
		</div>
	)};
}

export default SopaDeLetras;
