import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StudentData } from '../types';

const formatDateExtenso = (dateStr: string) => {
  if (!dateStr) return '';
  let year, month, day;
  if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-');
  } else if (dateStr.includes('/')) {
    [day, month, year] = dateStr.split('/');
  } else {
    return dateStr;
  }
  
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const monthName = months[parseInt(month, 10) - 1];
  if (monthName) return `${parseInt(day, 10)} de ${monthName} de ${year}`;
  return dateStr;
};

const formatPeriodExtenso = (start: string, end: string, fallback?: string) => {
  if (!start || !end) return fallback || '';
  
  const parseDate = (d: string) => {
    if (d.includes('-')) return d.split('-');
    if (d.includes('/')) {
      const [day, month, year] = d.split('/');
      return [year, month, day];
    }
    return [];
  };
  
  const [sYear, sMonth, sDay] = parseDate(start);
  const [eYear, eMonth, eDay] = parseDate(end);
  
  if (!sYear || !eYear) return fallback || '';

  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const sMonthName = months[parseInt(sMonth, 10) - 1];
  const eMonthName = months[parseInt(eMonth, 10) - 1];

  if (sYear === eYear && sMonth === eMonth) {
      return `${parseInt(sDay, 10)} a ${parseInt(eDay, 10)} de ${sMonthName} de ${sYear}`;
  } else if (sYear === eYear) {
      return `${parseInt(sDay, 10)} de ${sMonthName} a ${parseInt(eDay, 10)} de ${eMonthName} de ${sYear}`;
  } else {
      return `${parseInt(sDay, 10)} de ${sMonthName} de ${sYear} a ${parseInt(eDay, 10)} de ${eMonthName} de ${eYear}`;
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#F9F9F6', // Cor de papel creme/pergaminho
    padding: 25,
    fontFamily: 'Times-Roman',
  },
  outerBorder: {
    border: '3pt solid #111827', // Preto/chumbo escuro
    padding: 2,
    height: '100%',
  },
  middleBorder: {
    border: '1pt solid #111827',
    padding: 2,
    height: '100%',
  },
  innerBorder: {
    border: '1pt solid #111827',
    height: '100%',
    padding: 35,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  leftBadge: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 55,
    height: 75,
    objectFit: 'contain',
  },
  rightContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    alignItems: 'center',
  },
  rightBadge: {
    width: 55,
    height: 75,
    objectFit: 'contain',
    marginBottom: 4,
  },
  controlNumber: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: '#4b5563',
  },
  federalText: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 1.2,
    color: '#111827',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Times-Bold',
    letterSpacing: 1.5,
    marginTop: 25,
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Times-Roman',
    lineHeight: 1.8,
    textAlign: 'justify',
    marginTop: 10,
    marginBottom: 40,
    color: '#111827',
    paddingHorizontal: 20,
  },
  boldText: {
    fontFamily: 'Times-Bold',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 35,
    color: '#111827',
  },
  signatureContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  signatureImage: {
    width: 140,
    height: 60,
    objectFit: 'contain',
    marginBottom: 2,
    zIndex: 10,
  },
  signatureLine: {
    width: 280,
    height: 1,
    backgroundColor: '#111827',
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#111827',
  },
  signatureRole: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#111827',
    marginTop: 2,
  },
  footerRight: {
    position: 'absolute',
    bottom: -15,
    right: -10,
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 8,
    textAlign: 'right',
    lineHeight: 1.5,
    color: '#6b7280',
    fontFamily: 'Times-Roman',
  }
});

interface CertificateProps {
  key?: React.Key;
  student: StudentData;
  directorName: string;
  directorSignature: string | null;
  leftBadge: string | null;
  rightBadge: string | null;
}

export const CertificatePage = ({ student, directorName, directorSignature, leftBadge, rightBadge }: CertificateProps) => (
  <Page size="A4" orientation="landscape" style={styles.page}>
    <View style={styles.outerBorder}>
      <View style={styles.middleBorder}>
        <View style={styles.innerBorder}>
          
          <View style={styles.header}>
            <Image src={leftBadge || "/segexsf.png"} style={styles.leftBadge} />
            
            <View style={styles.rightContainer}>
              <Image src={rightBadge || "/badmqgex2.png"} style={styles.rightBadge} />
              <Text style={styles.controlNumber}>{student.controlNumber}</Text>
            </View>
            
            <Text style={styles.federalText}>
              REPÚBLICA FEDERATIVA DO BRASIL{'\n'}
              MINISTÉRIO DA DEFESA{'\n'}
              EXÉRCITO BRASILEIRO
            </Text>

            <Text style={styles.title}>CERTIFICADO DE CONCLUSÃO</Text>
          </View>

          <Text style={styles.bodyText}>
            A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – 
            (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <Text style={styles.boldText}>{student.name.toUpperCase()}</Text>, 
            inscrito no CPF nº <Text style={styles.boldText}>{student.cpf}</Text> e no Nº REGISTRO <Text style={styles.boldText}>{student.registry}</Text>, 
            categoria "<Text style={styles.boldText}>{student.category}</Text>", concluiu com aproveitamento o Curso Especializado 
            para <Text style={styles.boldText}>{student.course}</Text>, ministrado pela IET - Forte Caxias, no período de 
            {' '}<Text style={styles.boldText}>{formatPeriodExtenso(student.periodStart, student.periodEnd, student.period)}</Text>, com carga horária de <Text style={styles.boldText}>{student.workload}</Text>, 
            com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.
          </Text>

          <Text style={styles.date}>
            Brasília-DF, {formatDateExtenso(student.issueDate)}.
          </Text>

          <View style={styles.signatureContainer}>
            {directorSignature ? (
              <Image src={directorSignature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 60 }} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{directorName.toUpperCase()}</Text>
            <Text style={styles.signatureRole}>Diretor Geral</Text>
            
            <View style={styles.footerRight}>
              <Text style={styles.footerText}>CNPJ Nº 21.744.847/0001-50</Text>
              <Text style={styles.footerText}>BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO</Text>
            </View>
          </View>

        </View>
      </View>
    </View>
  </Page>
);

export const SingleCertificatePDF = (props: CertificateProps) => (
  <Document>
    <CertificatePage {...props} />
  </Document>
);

export const BulkCertificatePDF = ({ students, directorName, directorSignature, leftBadge, rightBadge }: { students: StudentData[], directorName: string, directorSignature: string | null, leftBadge: string | null, rightBadge: string | null }) => (
  <Document>
    {students.map((student, index) => (
      <CertificatePage 
        key={index} 
        student={student} 
        directorName={directorName} 
        directorSignature={directorSignature} 
        leftBadge={leftBadge}
        rightBadge={rightBadge}
      />
    ))}
  </Document>
);
