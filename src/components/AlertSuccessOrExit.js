
import { 
    BackHandler, 
    Alert, 
} from 'react-native';

class AlertSuccessOrExit {
    alert(title, message, onDone) {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Exit',
                    onPress: BackHandler.exitApp,
                    style: 'destructive',
                },
                {
                    text: 'Done',
                    onPress: onDone
                },
            ],
            { cancelable: false },
        );
    }
}
export default AlertSuccessOrExit;
