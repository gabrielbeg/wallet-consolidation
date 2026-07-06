'use client'
import dynamic from "next/dynamic";

// Use dynamic importing, otherwise we will have a server-side error(Using 'use client' is not enough) which is not compatible.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false
  });
import React from "react";
import { Document, Page, View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { ConvertToCurrency } from "@/services/utils";

const GADE_NAVY = '#00263e';
const GADE_GOLD = '#C8C3AF';
const GADE_GOLD_DARK = '#968F75';
const GADE_PANEL = '#F5F4F0';

/**
* * Styles for the PDF document
*/
const styles = StyleSheet.create({
  page: {
    backgroundColor: GADE_NAVY,
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  logo: {
    width: 60,
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
    color: GADE_GOLD,
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
    backgroundColor: GADE_PANEL,
    borderRadius: 6,
    border: `1px solid ${GADE_GOLD}`,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: GADE_NAVY,
  },
  row: {
    backgroundColor: GADE_PANEL,
    borderRadius: 4,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    border: `1px solid ${GADE_GOLD_DARK}`,
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
    width: '48%',
    height: '60px',
    backgroundColor: GADE_PANEL,
    borderRadius: 4,
    marginBottom: 20,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    border: `1px solid ${GADE_GOLD}`,
  },
  resumoTitle: {
    fontSize: 12,
    marginBottom: 2,
    color: GADE_NAVY,
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GADE_NAVY,
  },
  operationsText: {
    width: '30%'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: GADE_GOLD,
    marginBottom: 10,
  },
  sectionHeading: {
    color: GADE_GOLD,
    fontSize: 12,
    marginBottom: 2,
  },
  disclaimer: {
    color: '#FFF',
    overflowWrap: 'normal',
    textJustify: 'distribute',
    width: '100%',
    marginTop: '10px',
    fontSize: 9,
  },
});

/**
 * Deals with the monthly report generation and download
 * @param {*} data 
 * @returns 
 */
function MonthlyReport(data) {
  const gadeData = {
    data: {
      ...data.data
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full my-5">
      <PDFDownloadLink document={<MyDocument data={gadeData} />} fileName={`${data.data.customer}.pdf`}>
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
const MyDocument = ({ data }) => {
  data = data.data;
  try {
    return (
      <Document>
        <Page size="A4" style={styles.page} wrap={false}>
          <Image src="/gade-logo.png" style={styles.logo} />
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
                <View style={styles.row} key={index}>
                  <Text style={[styles.operationsText, { textAlign: 'left' }]}>{operation.fund}</Text>
                  <Text style={[styles.operationsText, { textAlign: 'center' }]}>{operation.date}</Text>
                  <Text style={[styles.operationsText, { textAlign: 'right' }]}>{ConvertToCurrency(operation.value)}</Text>
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

            <View style={{ width: '100%', marginTop: '20px' }}>
              <Text style={styles.sectionHeading}>Dados Brutos</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.resumo}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>Resultado Financeiro</Text>
                <Text style={styles.resumoValue}>{ConvertToCurrency(data.netTotal)}</Text>
              </View>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>Resultado Percentual</Text>
                <Text style={styles.resumoValue}>{data.approximateProfit}%</Text>
              </View>
              {/* <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>CDI Correspondente</Text>
                <Text style={styles.resumoValue}>{data.cdiProfit}%</Text>
              </View> */}
            </View>

            {/* <View style={{ width: '100%' }}>
              <Text style={styles.sectionHeading}>Dados Líquidos - Considerando Taxa de Consultoria</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.resumo}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>Resultado Financeiro</Text>
                <Text style={styles.resumoValue}>{ConvertToCurrency(data.netMinusFee)}</Text>
              </View>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>Resultado Percentual</Text>
                <Text style={styles.resumoValue}>{data.profitabilityMinusFee}%</Text>
              </View>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>CDI Correspondente</Text>
                <Text style={styles.resumoValue}>{data.cdiPercentage}%</Text>
              </View>
            </View> */}

            <View style={[styles.resumo, { alignItems: 'center'}]}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>Taxa de Consultoria</Text>
                <Text style={styles.resumoValue}>{ConvertToCurrency(data.serviceFee)}</Text>
              </View>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoTitle}>CDI no período</Text>
                <Text style={styles.resumoValue}>{data.cdi}%</Text>
              </View>
            </View>
            {/* Remover CNPJ
            <Text style={[styles.disclaimer, { marginTop: 0, marginBottom: 10 }]}>
              CNPJ: 57.866.610/0001-90
            </Text>
            */}
            
            <Text style={styles.disclaimer}>
            A fim de manter os parâmetros para eventuais comparativos entre Bancos e Corretoras, os valores estão apresentados brutos e também sem a taxa de consultoria. Para valores líquidos de IR e IOF, segue relatório complementar emitido pela corretora.
            </Text>
          
          </View>
        </Page>
      </Document>
    )
  }
  catch (ex) {
    console.error(ex);
    return (
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
