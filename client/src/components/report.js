'use client'
import dynamic from "next/dynamic";

// Use dynamic importing, otherwise we will have a server-side error(Using 'use client' is not enough) which is not compatible.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false
  });
import React, { useEffect } from "react";
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
  paymentBox:{
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumoTitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  operationsText: {
    width: '30%'
  }
});
  
/**
 * Deals with the monthly report generation and download
 * It awaits for the QRCode to be generated and then displays the download button accordingly
 * @param {*} data 
 * @returns 
 */
function MonthlyReport(data){
  const[qrCode, setQrCode] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(true);
    RetrieveQrCode(data.data.serviceFee).then((response) =>
    {
      if(response.statusCode === 200) {
        response = JSON.parse(response.body);
        setQrCode(response.qrCode);
        setLoading(false);
      }
      else
      {
        setError(new Error('QR Code não gerado'));
        setLoading(false);
      }
    }).catch((error) => {
      console.error(error);
      setError(error);
      setLoading(false);
    })
  }, [qrCode]);

  if(error) {
    return <p style={styles.error}>Erro ao gerar QR Code: {error.message}</p>;
  }
  if(loading) {
    return(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ 
      width: '40px', 
      height: '40px', 
      border: '4px solid rgba(0, 0, 0, 0.1)', 
      borderTopColor: '#007BFF', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
      }}></div>
      <style jsx>{`
      @keyframes spin {
        to {transform: rotate(360deg);}
      }
      `}</style>
    </div>);
  }

  const newData = {
    data: {
      ...data.data,
      qrCode: qrCode
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full my-5">
      <PDFDownloadLink document={<MyDocument data={newData}/>} fileName={`${data.data.customer}.pdf`}>
        <button className="px-5 py-3 mx-2.5 bg-blue-500 text-white border-0 rounded cursor-pointer shadow transition-colors duration-300 ease-in-out hover:bg-blue-600">
          Download
        </button>
      </PDFDownloadLink>
    </div>
  );
};

/**
 * PDF Document for the monthly report
 * @param {*} data 
 * @returns 
 */
const MyDocument = ({data}) => {
  data = data.data;
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
                <Text style={[styles.operationsText, {textAlign:'left'}]}>{operation.fund}</Text>
                <Text style={[styles.operationsText,{textAlign: 'center'}]}>{operation.date}</Text>
                <Text style={[styles.operationsText,{textAlign: 'right'}]}>{ConvertToCurrency(operation.value)}</Text>
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
          <View style={styles.paymentBox}>
            {data.qrCode && <Image src={data.qrCode} style={{ width: 100}}/>}
          </View>
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