import './App.css'
import { Grid } from '@mui/material'
import HeaderUI from './components/HeaderUI'
import AlertUI from './components/AlertUI'
import SelectorUI from './components/SelectorUI'
import IndicatorUI from './components/IndicatorUI'
import useFetchData from './functions/useFetchData';

function App() {

  const {data,loading,error} = useFetchData();

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}> 
        <HeaderUI/> 
      </Grid>

      {/* Alertas */}
      <Grid container justifyContent="right" alignItems="center">

        <AlertUI description='No se preveen lluvias'/>
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3  }}>
        <SelectorUI/>

      </Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        {loading && (
          <Grid size={12}>
            <h2>Cargando datos...</h2>
          </Grid>
        )}

        {error && (
          <Grid size={12}>
            <h2 style={{ color: "red" }}>Error: {error}</h2>
          </Grid>
        )}

         {data && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Temperatura (2m)'
                description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Temperatura aparente'
                description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Velocidad del viento'
                description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Humedad relativa'
                description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`}
              />
            </Grid>
          </>
        )}


      </Grid> 

      {/* Gráfico */}
      <Grid sx={{ display: { xs: "none", md: "block"} }}>Elemento: Gráfico</Grid>

      {/* Tabla */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>Elemento: Tabla</Grid>

      {/* Información adicional */}
      <Grid>Elemento: Información adicional</Grid>

    </Grid>
  )
}

export default App
