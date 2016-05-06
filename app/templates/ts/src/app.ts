import { ui } from 'tabris';
import MainPage from './MainPage';

ui.set({
  background: 'rgb(200, 50, 50)',
  textColor: 'white',
  statusBarTheme: 'dark'
});

new MainPage().open();
