import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import {
    loginWithFacebook,
    logOut,
} from '../firebase/auth';
import * as actions from '../redux/actions';

import $S from '../styles';

import Button from '../components/Button';
import DismissButton from '../components/DismissButton';
import Error from '../components/Error';


class SignupScreen extends React.Component {
    static navigationOptions = {
        title: 'Sign Up'
    };

    constructor(props) {
        super(props);
        this.state = {
            params: {}
        };
    }

    onSubmit = () => {
        if (this.disabled())
            return;

        const {params} = this.state;
        this.props.linkToEmail(params.email, params.password);
    }

    disabled = () => {
        const {params} = this.state;
        return !params || !params.email || !params.password || (params.password !== params.confirmPassword);
    }

    render() {
        const {params} = this.state;
        const {error, navigation} = this.props;
        const setParam = param => (text => this.setState(({params}) => ({params: { ...params, [param]: text }})));
        const currentUser = this.props.currentUser && this.props.currentUser.toJS();
        const providers = currentUser && currentUser.providerData.reduce(
            (map, provider) => {
                map[provider.providerId] = provider;
                return map;
            }, {});

        return (
            <View style={[$S.container, $S.form]}>
              <DismissButton/>
              {error && <Error error={error.toJS()}/>}
              {
              !providers['password'] ?
                  <>
                    <View style={$S.inputGroup}>
                      <Text style={$S.inputLabel}>Email</Text>
                      <TextInput style={$S.textInput}
                                 autoCapitalize="none"
                                 autoCompleteType="email"
                                 autoFocus={true}
                                 keyboardType="email-address"
                                 value={params.email}
                                 onChangeText={setParam('email')}
                      />
                    </View>
                    <View style={$S.inputGroup}>
                      <Text style={$S.inputLabel}>Password</Text>
                      <TextInput style={$S.textInput}
                                 autoCompleteType="password"
                                 secureTextEntry={true}
                                 onChangeText={setParam('password')}
                                 value={params.password}
                      />
                    </View>
                    {!!params.password && <View style={$S.inputGroup}>
                                            <Text style={$S.inputLabel}>Retype Pasword</Text>
                                            <TextInput style={$S.textInput}
                                                       autoCompleteType="password"
                                                       secureTextEntry={true}
                                                       onChangeText={setParam('confirmPassword')}
                                                       value={params.confirmPassword}
                                            />
                                          </View>}
                    <Button title="Register"
                            primary
                            onPress={this.onSubmit}
                            style={{ marginTop: 20 }}
                            disabled={this.disabled()} />
                  </> :

                  <>
                    <Text style={{}}>
                      Linked to email address: {providers['password']['email']}
                    </Text>
                  </>
              }
            {
                  providers['facebook.com'] ?
                      (
                          <Button primary onPress={logOut} title="Disconnect Facebook" />
                      ) :
                      (
                          <Button
                            primary
                            onPress={loginWithFacebook}
                            title="Facebook Login"
                          />
                      )
              }
              {
                  providers['google.com'] ?
                      (
                          <Button primary onPress={logOut} title="Disconnect Google" />
                      ) :
                      (
                          <Button
                            primary
                            onPress={this.props.linkToGoogle}
                            title="Google Login"
                          />
                      )
              }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    contentContainer: {
        paddingTop: 30,
    }
});

const ReduxSignupScreen = connect(
  state => ({
      error: state.users.get("signupError"),
      currentUser: state.users.get("current"),
  }),
    dispatch => ({
        linkToEmail: (...args) => dispatch(actions.linkToEmail(...args)),
        linkToGoogle: (...args) => dispatch(actions.linkToGoogle(...args)),
    })
)(SignupScreen);

export default ReduxSignupScreen;
