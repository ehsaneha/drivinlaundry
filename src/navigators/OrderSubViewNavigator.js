import { createStackNavigator } from 'react-navigation'

import { 
    ClothingSelectionScreen,
    TimeSelectionScreen,
    LocationSelectionScreen,
    CarSelectionScreen,
    LaundrySelectionScreen,
    OrderReciepeScreen,
    PaymentScreen,
} from '../screens'
import { fadeIn } from 'react-navigation-transitions';



const OrderSubViewNavigator = createStackNavigator({
    ClothingSelection: ClothingSelectionScreen,
    TimeSelection: TimeSelectionScreen,
    LocationSelection: LocationSelectionScreen,
    CarSelection: CarSelectionScreen,
    LaundrySelection: LaundrySelectionScreen,
    OrderReciepe: OrderReciepeScreen,
    Payment: PaymentScreen,
}, 
{
    transitionConfig: () => fadeIn(),
    headerMode: 'none',
    transparentCard: true,
});

export default OrderSubViewNavigator;