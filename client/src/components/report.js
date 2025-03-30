'use client'
import dynamic from "next/dynamic";

// Use dynamic importing, otherwise we will have a server-side error(Using 'use client' is not enough) which is not compatible.
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });
import React from "react";
import { Document, Page, View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { ConvertToCurrency } from "@/services/utils";
import RetrieveQrCode from "@/api/qrCodeGenerator";

  /**
 * * Styles for the PDF document
 */
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#2D0E0E',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  logo: {
    width: 100,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  container: {
    padding: 20,
    borderRadius: 8,
  },
  header: {
    color: '#FFF',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  subtitle: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 10,
    textAlign: 'right',
  },
  section: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    border: '1px solid #FFF',
    opacity: 0.85,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    border: '1px solid #FFF',
    opacity: 0.85,
  },
  total: {
    paddingTop: 4,
    marginTop: 4,
    fontWeight: 'bold',
  },
  movimentacoesPositive: {
    backgroundColor: 'lightgreen',
    borderColor: 'darkgreen',
  },
  movimentacoesNegative: {
    backgroundColor: 'salmon',
    borderColor: 'darkred',
  },
  resumo: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resumoBox: {
    width: '30%',
    height: '60px',
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 20,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  resumoTitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
  
function MonthlyReport(data){
  return(
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
    <PDFViewer style={{ width: '80%', height: '80vh' }} showToolbar={true}>
      <MyDocument data={data}/>
    </PDFViewer>
    <PDFDownloadLink document={<MyDocument data={data}/>} fileName={`${data.data.customer}.pdf`}>
    <button style={{ marginTop: 20, padding: 10, backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: 5 }}>Baixar PDF</button>
    </PDFDownloadLink>
  </div>
  );
};

/**
 * Build document for PDF
 * @param {*} data 
 * @returns 
 */
const MyDocument = ({data}) => {
  data = data.data;
  const qrCode = RetrieveQrCode(data.serviceFee);
  console.log(data);
  try{
  return(
  <Document>
    <Page size="A4" style={styles.page} wrap={false}>
      <Image src="/logo.png" style={styles.logo}/>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.customer}</Text>
          <Text style={styles.subtitle}>Relatório mensal ({data.dateStart} - {data.dateEnd})</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carteira - {data.dateStart}</Text>
          {data.funds.map((fund, index) => (
            <View style={styles.row} key={index}>
              <Text>{fund.name}</Text>
              <Text>{ConvertToCurrency(fund.startValue)}</Text>
            </View>
            ))}
          <View style={[styles.row, styles.total]}><Text>Total:</Text><Text>{ConvertToCurrency(data.startValue)}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movimentações</Text>
          {data.operations.map((operation, index) => (
              <View style={[styles.row, operation.type === 'Aporte' ? styles.movimentacoesPositive : styles.movimentacoesNegative]} key={index}>
                <Text>{operation.fund}</Text>
                <Text>{operation.date}</Text>
                <Text>{ConvertToCurrency(operation.value)}</Text>
              </View>
          ))}
          <View style={[styles.row, styles.total]}><Text>Total:</Text><Text>{ConvertToCurrency(data.totalOperations)}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carteira - {data.dateEnd}</Text>
          {data.funds.map((fund, index) => (
            <View style={styles.row} key={index}>
              <Text>{fund.name}</Text>
              <Text>{ConvertToCurrency(fund.endValue)}</Text>
            </View>
          ))}
          <View style={[styles.row, styles.total]}><Text>Total:</Text><Text>{ConvertToCurrency(data.endValue)}</Text></View>
        </View>

        <View style={styles.resumo}>
          <View style={styles.resumoBox}>
            <Text style={styles.resumoTitle}>Resultado Líquido</Text>
            <Text style={styles.resumoValue}>{ConvertToCurrency(data.netTotal)}</Text>
          </View>
          <View style={styles.resumoBox}>
            <Text style={styles.resumoTitle}>Rentabilidade</Text>
            <Text style={styles.resumoValue}>{(data.approximateProfit*100).toFixed(2)}%</Text>
          </View>
          <View style={styles.resumoBox}>
            <Text style={styles.resumoTitle}>CDI no período</Text>
            <Text style={styles.resumoValue}>{ConvertToCurrency(data.cdi)}%</Text>
          </View>
          <View style={styles.resumoBox}>
            <Text style={styles.resumoTitle}>Taxa de Consultoria</Text>
            <Text style={styles.resumoValue}>{ConvertToCurrency(data.serviceFee)}</Text>
          </View>
        </View>
          <View>
            {qrCode && <Image src={qrCode} style={{ width: 100, margin: '0 auto' }}/>}
          </View>
      </View>
    </Page>
  </Document>
  )
}
catch(ex)
{
  console.error(ex);
  return(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.title}>Erro ao gerar relatório</Text>
          <Text style={styles.subtitle}>Verifique se o arquivo está correto e tente novamente.</Text>
        </View>
      </Page>
    </Document>
  )
}
};

export default MonthlyReport;