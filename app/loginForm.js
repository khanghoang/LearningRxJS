import React from 'react';
import {
  createEventHandler,
  mapPropsStream,
  setObservableConfig,
} from 'recompose';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import rxjsconfig from 'recompose/rxjsObservableConfig';

setObservableConfig(rxjsconfig);

const LoginForm = ({
  onUsernameChange,
  onPasswordChange,
  isShowLoginButton,
}) => (
  <View style={styles.container}>
    <Text style={styles.instructions}>
      To get started, edit index.ios.js
    </Text>
    <View>
      <TextInput
        onChangeText={onUsernameChange}
        style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
      />
      <TextInput
        onChangeText={onPasswordChange}
        style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
      />
    </View>
    {isShowLoginButton &&
      <TouchableOpacity><Text>{'Login'}</Text></TouchableOpacity>}
  </View>
);

const enhance = mapPropsStream(
  props$ => {
    const {
      handler: onUsernameChange,
      stream: onUsernameChange$,
    } = createEventHandler();

    const {
      handler: onPasswordChange,
      stream: onPasswordChange$,
    } = createEventHandler();

    const inputs$ = onUsernameChange$.combineLatest(
      onPasswordChange$,
      (username, password) => ({ username, password })
    )
      .startWith({ username: '', password: '' })
      .map(({ username, password }) => {
        if (username && password) {
          return {
            username,
            password,
            isShowLoginButton: true,
          };
        }

        return {
          username,
          password,
          isShowLoginButton: false,
        };
      });

    return props$.combineLatest(
      inputs$,
      (props, data) => ({
        ...props,
        onUsernameChange,
        onPasswordChange,
        ...data,
      })
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default enhance(LoginForm);
