import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../../lib/theme';

export default function ScanScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required to scan barcodes</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: any) => {
    if (scanned) return;
    setScanned(true);

    if (data) {
      navigation.navigate('RequisitionReview', { barcode: data, type });
    }
  };

  const resetScan = () => {
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Product</Text>
        <TouchableOpacity onPress={resetScan}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'ean13', 'ean8', 'upc_a', 'upc_e', 'pdf417'],
        }}
      >
        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      <View style={styles.controls}>
        <Text style={styles.hintText}>Position barcode within frame</Text>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>🔦</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>🖼️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: 'rgba(0,0,0,0.5)' },
  backButton: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '500' },
  closeButton: { color: '#fff', fontSize: 20 },
  camera: { flex: 1 },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 200, height: 150, borderColor: '#F97316', borderWidth: 2, borderRadius: 12 },
  controls: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'rgba(0,0,0,0.8)' },
  hintText: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 16, fontSize: 14 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around' },
  toolButton: { padding: 12 },
  toolText: { fontSize: 24 },
  primaryButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginTop: theme.spacing.lg },
  primaryButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
  text: { color: theme.colors.text, fontSize: theme.typography.md, textAlign: 'center', marginTop: 40 },
});