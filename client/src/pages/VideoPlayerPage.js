import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Stack,
  TextField,
  FormControl,
  Typography,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ReactPlayer from "react-player";

import { useFormik } from "formik";
import * as yup from "yup";

import axios from "axios";

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "left",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

/**
 *  Create a MUI form to save below video properties: 
    title, description, visibility, 
    thumbnailUrl, language, recordingDate, 
    category,
 */

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  visibility: yup.string().required("Visibility is required"),
  thumbnailUrl: yup.string().required("Thumbnail URL is required"),
  language: yup.string().required("Language is required"),
  recordingDate: yup.date().required("Recording date is required"),
  category: yup.string().required("Category is required"),
});

export default function VideoUploadPage() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // axios post the values to the backend
  const postToServer = async (values) => {
    const { title } = values;
    const videoFile = values.videoFile;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/videos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        }
      );
      setAlertType("success");
      setUploadResponse(response.data.message);
      console.log(response);
    } catch (error) {
      console.log(error);
      setAlertType("error");
      setUploadResponse(error.response.data.error.message);
    }
  };

  const formik = useFormik({
    initialErrors: {
      videoFile: "Video file is required",
    },
    initialValues: {
      title: "title1",
      description: "desc",
      visibility: "public",
      thumbnailUrl: "test",
      language: "Bangla",
      recordingDate: new Date(),
      category: "Education",
      videoFile: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await postToServer(values);
    },
    validate: (values) => {
      const errors = {};
      if (!values.videoFile) {
        errors.videoFile = "Video file is required";
      }
      // check videoFile size
      if (values.videoFile?.size > 52428000) {
        errors.videoFile = "Video file size should be less than 50MB";
      }

      // check videoFile type, must be video/mp4 or video/x-matroska
      if (
        values.videoFile?.type !== "video/mp4" &&
        values.videoFile?.type !== "video/x-matroska"
      ) {
        errors.videoFile = "Video file type should be .mp4 or .mkv";
      }

      return errors;
    },
  });

  return (
    <>
      <Helmet>
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
                url="http://localhost:4001/video-1675165791212-82597508.m3u8"
                controls
                playing
                width="100%"
                height="100%"
                config={{
                  file: { attributes: { controlsList: "nodownload" } },
                }}
              />
            </Stack>
          </StyledContent>
        </Container>
      </>
    </>
  );
}
