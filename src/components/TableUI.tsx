 /* import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   {
      field: 'label',
      headerName: 'Label',
      width: 125,
   },
   {
      field: 'value1',
      headerName: 'Value 1',
      width: 125,
   },
   {
      field: 'value2',
      headerName: 'Value 2',
      width: 125,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 100,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];

const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const arrLabels = ['A','B','C','D','E','F','G'];

export default function TableUI() {

   const rows = combineArrays(arrLabels, arrValues1, arrValues2);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}

*/

import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import useFetchData from '../functions/useFetchData';
import CircularProgress from '@mui/material/CircularProgress';

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   {
      field: 'label',
      headerName: 'Hora',
      width: 125,
   },
   {
      field: 'value1',
      headerName: 'Temperatura (°C)',
      width: 125,
   },
   {
      field: 'value2',
      headerName: 'Viento (km/h)',
      width: 125,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 200,
      valueGetter: (_, row) => `${row.label || ''} - ${row.value1 || ''}°C - ${row.value2 || ''}km/h`,
   },
];

export default function TableUI() {
   const {data, loading, error} = useFetchData();

   // Manejo de estado de carga
   if (!data) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
            <CircularProgress />
         </Box>
      );
   }

   // Extraer datos horarios (primeras 24 horas)
   const arrLabels = data.hourly.time.slice(0, 24).map(time => {
      const date = new Date(time);
      return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
   });
   const arrValues1 = data.hourly.temperature_2m.slice(0, 24);
   const arrValues2 = data.hourly.wind_speed_10m.slice(0, 24);

   const rows = combineArrays(arrLabels, arrValues1, arrValues2);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}