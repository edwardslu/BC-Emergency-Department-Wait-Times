import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";


const Hospitals = () => {
    const [waitTimes, setWaitTimes] = useState([]);
    const apiUrl = "https://edwaittimes.ca/api/wait-times";

    useEffect(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setWaitTimes(data || []))
            .catch(error => console.error("Error:", error));
    }, []);

    const isOpenNow = (hospital) => {
        if (hospital.open247) return true;

        const now = new Date(); // API returns GMT time by default. If not converted, it will return the incorrect time.
        const pacificTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Vancouver" })); //This converts GMT to Pacific Time.
        const currentDay = pacificTime.getDay();
        const currentTime = pacificTime.getHours() * 60 + pacificTime.getMinutes();

        const todaySchedule = hospital.operatingHours?.days[currentDay];
        if (!todaySchedule?.open || !todaySchedule?.close) return false;

        const openTime = new Date(todaySchedule.open);
        const closeTime = new Date(todaySchedule.close);

        const openTimePT = new Date(openTime.toLocaleString("en-US", { timeZone: "America/Vancouver" })); //These two lines convert the open and close times from GMT to Pacific Time.
        const closeTimePT = new Date(closeTime.toLocaleString("en-US", { timeZone: "America/Vancouver" }));

        const openTimeFinal = openTimePT.getHours() * 60 + openTimePT.getMinutes();
        const closeTimeFinal = closeTimePT.getHours() * 60 + closeTimePT.getMinutes();

        return currentTime >= openTimeFinal && currentTime <= closeTimeFinal;
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row>
                <Col>
                    {waitTimes.map(hospital => (
                        <p key={hospital.slug} id={`${hospital.slug}Time`}>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.name}`}
                                target="_blank"
                                rel="noopener noreferrer">
                                {hospital.name.replace(/[".]/g, '')}
                            </a>:{" "}
                            {hospital.open247 || isOpenNow(hospital)
                                ? hospital.waitTime?.waitTimeMinutes !== undefined
                                    ? `${Math.floor(hospital.waitTime.waitTimeMinutes / 60)} hours and ${hospital.waitTime.waitTimeMinutes % 60} minutes`
                                    : "Wait time information unavailable"
                                : "Currently Closed"}
                        </p>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default Hospitals;
