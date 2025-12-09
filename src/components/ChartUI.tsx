 /* import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const arrLabels = ['A','B','C','D','E','F','G'];


export default function ChartUI() {
   return (
      <>
         <Typography variant="h5" component="div">
            Chart arrLabels vs arrValues1 & arrValues2
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: arrValues1, label: 'value1'},
               { data: arrValues2, label: 'value2'},
            ]}
            xAxis={[{ scaleType: 'point', data: arrLabels }]}
         />
      </>
   );
}

*/

import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useFetchData from '../functions/useFetchData';

export default function ChartUI() {
   const {data, loading, error} = useFetchData();

   // Manejo de estado de carga
   if (!data) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
         </Box>
      );
   }

   // Extraer datos horarios (primeras 24 horas)
   const arrLabels = data.hourly.time.slice(0, 24).map(time => {
      const date = new Date(time);
      return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
   });
   const arrTemperature = data.hourly.temperature_2m.slice(0, 24);
   const arrWindSpeed = data.hourly.wind_speed_10m.slice(0, 24);

   return (
      <>
         <Typography variant="h5" component="div">
            Temperatura y Viento - Próximas 24 horas
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: arrTemperature, label: 'Temperatura (°C)' },
               { data: arrWindSpeed, label: 'Viento (km/h)' },
            ]}
            xAxis={[{ scaleType: 'point', data: arrLabels }]}
         />
      </>
   );
}