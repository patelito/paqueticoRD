import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { MonoText } from '../components/StyledText';
import {
  Header,
  Icon,
  ButtonGroup,
  Card,
  Button
} from 'react-native-elements';


import {connect} from "react-redux";

import RadioButtons from '../components/wraperCards';
import TabPop from '../components/tabPop';
import CreditCard from '../components/creditCards';

class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: null,
      methodid:null,
      isSelected: false,
      selectedCards: false,
      creditSelect: null,
      processData: {},
      numberCard:null,
      paymentsMethods:[
        {
          method: 'Tarjeta',
          text:'Tarjeta',
          intermediate: 'Visa',
          bank: 'Scotiabank'
        },
        {
          method: 'Paypal',
          text:'Paypal',
          intermediate: 'Paypal.co'
        }
      ]
    }

  }
  componentWillMount() {
    const { plan, processData } = this.props.navigation.state.params;
    this.setState({ 
      plan: plan,
      processData: processData })
  }


  paymentSelected = (payment) => {
    if(payment == "Tarjeta")
    {
      this.setState({
        selectedCards: true
      })
    }else{
      this.setState({
        selectedCards: false
      })
    }
   
    this.setState({ 
      selected: true, 
      selected: payment 
    }, () => {
      const processData = {
        ...this.state.processData,
        payment: this.state.selected
      }

      this.setState({ processData: processData })
    })
  }

  _keyExtractor = (item) => item.id;

  renderMethods = () => {
   return(
     <View style={{ margin: 15 }}>
       <RadioButtons
         data={this.state.paymentsMethods}
         opSelect={(op) => this.paymentSelected(op)}
       />
     </View>
   ) 
  }

  renderTabPop(){
    const textPlan = this.state.plan == 'voice' ? 'voz' : 'data';

    if (this.state.selected){
      return (
        <TabPop
          title={'Pago'}
          overview={`Pagaras con ${this.state.selected} a tu plan de ${textPlan} `}
          textButton={'SEGUIR'}
          onPress={() => this.props.navigation.navigate(
            'Checkout',
            {
              processData: this.state.processData,
              paymentMethodId: this.state.methodid,
              numberCard: this.state.numberCard,
              plan: 'voice',
              measure: 'minutos'
            }
          )}
        />
      )
    }else{
      return null
    }
   
  } 

  render() {
    let cards = this.props.cards;
    return (
      <View style={styles.container}>
        <View style={styles.selfContainer}>
          <Text style={{
            fontWeight: '600',
            fontSize: 28
          }}>¿Cual seria tu metodo de pago?</Text>
          {this.renderMethods()}
        </View>
        {this.state.selectedCards ?
        <View style={{flex:1}}>
          <Text style={{ textAlign: 'center' }}>Selecciona la tarjeta que desea usar</Text>
          {
            cards.length > 0 ?
                  <FlatList
                    style={{ flex: 1 }}
                    data={cards}
                    renderItem={({ item }) => (
                      <CreditCard
                        numberCard={item.number}
                        key={item.number}
                        type={item.type}
                        idCard={item.id}
                        nameCard={item.name}
                        isFocus={this.state.creditSelect == item.number ? true : false}
                        onPress={(num) => {
                         
                         this.setState(
                           {
                             methodid: item.id,
                              numberCard: item.number,
                              creditSelect: num
                            })
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => "K" + item.number}
                  />
              :
            <Text style={{textAlign:'center'}}>No tiene tarjetas guardadas</Text>
          }
          {
            this.state.selected ? 
            <View style={{height: 100, width: "100%"}}></View>
            :
            null

          }
            
        </View>
         
        :
        null
      }
        {
          this.renderTabPop()
         
        }

      </View>
    );
  }
}

const mapStateToProps = state => {
  const cards = state.paymentMethods.paymentMethods;
  return {
    cards
  };
};

export default connect(mapStateToProps)(PaymentScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  selfContainer: {
    alignItems: 'center',
    flex: 1,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    padding: 25
  },
});
