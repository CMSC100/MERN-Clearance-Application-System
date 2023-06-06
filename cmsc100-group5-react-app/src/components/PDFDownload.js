import React, { useState, useEffect } from "react";
import { Page, Text, Document, View, StyleSheet } from '@react-pdf/renderer';

export default function PDFDownloader(props) {
    //details of user to be used when generating the PDF document
    const [user, setUser] = useState([])
    const [application, setApplication] = useState([])
    
    useEffect(() => {
        fetch(`http://localhost:3001/get-application-by-id?id=${props.application}`)
      .then(response => response.json())
      .then(body =>{ 
        console.log(body)
        if(body) {
            setApplication(body)
                fetch(`http://localhost:3001/get-clearance-officer-by-application-id/?id=${props.application}`).then(response => response.json())
            .then(body => {
                console.log(body)
                setClearanceOfficer(body)
            })}
    })}, [])

    useEffect(() => {
        fetch(`http://localhost:3001/get-user/?upmail=${localStorage.getItem("upmail")}`).then(response => response.json())
        .then(body => {
            setUser(body)
        })
    }, [])

    //details of adviser to be used when generating the PDF document
    const [adviser, setAdviser] = useState([])
    useEffect(() => {
        fetch(`http://localhost:3001/get-adviser/?upmail=${localStorage.getItem("upmail")}`).then(response => response.json())
        .then(body => {
            setAdviser(body)
        })
    }, [])

    const [clearanceOfficer, setClearanceOfficer] = useState([])

    const styles = StyleSheet.create({
    body: {
        paddingVertical: 70,
        paddingHorizontal: 70,
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        textAlign: "center",
        fontFamily: "Times-Roman",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: "center",
        fontFamily: "Times-Roman",
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: "justify",
        fontFamily: "Times-Roman",
        whiteSpace: "nowrap",
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
      },
    });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

return (
    <Document>
        <Page style={styles.body}>
            <Text style={styles.title} fixed>University of the Philippines Los Baños</Text>
            <Text style={styles.subtitle}>College of Arts and Sciences</Text>
            <Text style={styles.subtitle}>Institute of Computer Science</Text>
            <View style={styles.divider}/>
            <Text style={styles.text}>{today}</Text>
            <Text style={styles.text}>
                This document certifies that {user.mname === "" ? user.fname + " " + user.lname : user.fname + " " + user.mname + " " + user.lname}, {user.studentno} has satisfied the clearance requirements of the institute.
            </Text>
            <Text style={styles.text}>Verified:</Text>
            <Text style={styles.text}>Academic Adviser: {adviser.mname === "" ? adviser.fname + " " + adviser.lname : adviser.fname + " " + adviser.mname + " " + adviser.lname}</Text>
            <Text style={styles.text}>Clearance Officer: {clearanceOfficer.mname === "" ? clearanceOfficer.fname + " " + clearanceOfficer.lname : clearanceOfficer.fname + " " + clearanceOfficer.mname + " " + clearanceOfficer.lname}</Text>

        </Page>
    </Document>
)
}