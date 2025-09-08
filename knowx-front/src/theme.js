import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
    	primary: {
      		main: '#ff9bb3', // Rose principal
      		light: '#ffcdda', // Rose très clair
      		dark: '#e91e63',  // Rose un peu plus foncé pour les contrastes
    	},
    	secondary: {
      		main: '#f8bbd0', // Rose secondaire
    	},
    	background: {
      		default: '#fff5f7', // Rose blanc très très léger pour le fond
      		paper: '#ffffff',   // Blanc pur pour les cartes/paper
    	},
  	},
  	typography: {
    	h3: {
      		fontWeight: 'bold',
      		color: '#333333', // Gris foncé pour un bon contraste sur le fond clair
    	},
  	},
  	components: {
    	MuiAppBar: {
      		styleOverrides: {
        		root: {
          			backgroundColor: '#ff9bb3', // On utilise la couleur primary.main pour l'AppBar
          			color: '#ffffff', // Texte en blanc sur l'AppBar
        		},
      		},
    	},
    	MuiChip: {
      		styleOverrides: {
        		root: {
          			backgroundColor: '#ffcdda', // On utilise primary.light pour le fond du Chip
          			color: '#333333', // Texte en gris foncé pour être lisible
          			fontWeight: 'bold',
        		},
      		},
    	},
  	},
});

export default theme;
