import { createStackNavigator } from 'react-navigation'

import { 
    HomeScreen, 
    SettingsScreen,
    ServiceProcessScreen,
} from '../screens'
import { fadeIn } from 'react-navigation-transitions';


const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Settings: SettingsScreen,
}, 
{
    transitionConfig: () => fadeIn(),
    headerMode: 'none'
});

export default AppNavigator;