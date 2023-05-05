import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = () => {
    // TODO: Implement password change logic
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm New Password:', confirmNewPassword);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        secureTextEntry={true}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10, width: '80%' }}
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry={true}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10, width: '80%' }}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry={true}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, width: '80%' }}
        value={confirmNewPassword}
        onChangeText={(text) => setConfirmNewPassword(text)}
      />
      <TouchableOpacity onPress={handleChangePassword} style={{ backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white' }}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;