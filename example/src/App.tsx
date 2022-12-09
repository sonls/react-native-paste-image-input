import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import PasteInput from 'react-native-paste-image-input';

export default function App() {
  return (
    <View style={styles.container}>
      <PasteInput
        style={{ height: 49, width: '100%', backgroundColor: 'blue' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
