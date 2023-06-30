import React, { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Typography, Divider, Card, Box } from "@mui/material";

import ReactPlayer from "react-player";

import axios from "axios";

const StyledContent = styled("div")(({ theme }) => ({
    maxWidth: 800,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "top",
    alignContent: "center",
    alignItems: "left",
    flexDirection: "column",
    padding: theme.spacing(0, 0),
}));

export default function VideoUploadPage() {
    const [url, setUrl] = useState("");
    const [data, setData] = useState("");
    const { id } = useParams();

    useEffect(() => {
        console.log("id", id);

        const fetchData = async () => {
            const response = await axios.get(
                `http://localhost:4000/api/videos/detail/${id}`
            );
            // console.log(response);
            setData(response.data);
            // const videoDetails = await axios.get(

            // )
            const u = `http://localhost:4001/${response.data.fileName}.m3u8`;
            setUrl(u);
        };

        fetchData();
    }, [id]);
    console.log(data);

    return (
        <>
            {/* <Helmet>
                <title> Video upload</title>
            </Helmet>

            <>
                <Container>
                    <StyledContent>
                        <Typography variant="h4" sx={{ mb: 5 }}>
                            Upload video
                        </Typography>
                        <Stack>
                            <ReactPlayer
                                url={url}
                                controls
                                playing={false}
                                width="100%"
                                height="100%"
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: "nodownload",
                                        },
                                    },
                                }}
                            />
                        </Stack>
                    </StyledContent>
                </Container>
            </> */}

            {/* <Stack> */}
            <Helmet>
                <title> Video upload</title>
            </Helmet>
            <StyledContent>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    {data?.title || "Upload video"}
                </Typography>

                <ReactPlayer
                    url={url}
                    controls
                    playing={false}
                    width="100%"
                    height="100%"
                    config={{
                        file: {
                            attributes: { controlsList: "nodownload" },
                        },
                    }}
                />
                <Box
                    sx={{
                        bgcolor: "#457dbc",
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    {"description "}
                </Box>
            </StyledContent>
        </>
    );
}
