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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useFormik } from "formik";
import * as yup from "yup";

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "left",
  alignContent: "left",
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
  const formik = useFormik({
    initialValues: {
      title: "title1",
      description: "desc",
      visibility: "public",
      thumbnailUrl: "test",
      language: "Bangla",
      recordingDate: new Date(),
      category: "Education",
    },
    validationSchema: validationSchema,
    onSubmit: (values, helpers) => {
      console.log(values, helpers);
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
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <label htmlFor="video">
                  <input
                    style={{ display: "none" }}
                    name="video"
                    accept="video/*"
                    id="video"
                    type="file"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "videoFile",
                        e.currentTarget.files[0]
                      )
                    }
                  />
                  <Button
                    color="secondary"
                    variant="contained"
                    component="span"
                  >
                    Upload video
                  </Button>
                </label>
                {/* video file name display here */}
                <TextField value={formik.values.videoFile?.name} />
                <TextField
                  id="title"
                  name="title"
                  label="Video title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  id="description"
                  name="description"
                  label="Video description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <FormControl fullWidth>
                  <InputLabel id="visibility-select-label">
                    Visibility
                  </InputLabel>
                  <Select
                    labelId="visibility-select-label"
                    id="visibility-simple-select"
                    name="visibility"
                    label="Visibility"
                    value={formik.values.visibility}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.visibility)}
                    helperText={formik.errors.visibility}
                  >
                    <MenuItem value={"public"}>Public</MenuItem>
                    <MenuItem value={"private"}>Private</MenuItem>
                    <MenuItem value={"unlisted"}>Unlisted</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  label="Thumbnail URL"
                  value={formik.values.thumbnailUrl}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.thumbnailUrl &&
                    Boolean(formik.errors.thumbnailUrl)
                  }
                  helperText={
                    formik.touched.thumbnailUrl && formik.errors.thumbnailUrl
                  }
                />
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    id="language-simple-select"
                    label="Language"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.language)}
                    helperText={formik.errors.language}
                  >
                    <MenuItem value={"English"}>English</MenuItem>
                    <MenuItem value={"Bangla"}>Bangla</MenuItem>
                    <MenuItem value={"Spanish"}>Spanish</MenuItem>
                    <MenuItem value={"Hindi"}>Hindi</MenuItem>
                    <MenuItem value={"Urdu"}>Urdu</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Basic example"
                    value={formik.values.recordingDate}
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {
                      formik.setFieldValue("recordingDate", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-simple-select"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.category)}
                    helperText={formik.errors.category}
                  >
                    <MenuItem value={"Education"}>Education</MenuItem>
                    <MenuItem value={"Technology"}>Technology</MenuItem>
                    <MenuItem value={"Travel"}>Travel</MenuItem>
                    <MenuItem value={"Others"}>Others</MenuItem>
                  </Select>
                </FormControl>
                <LoadingButton
                  //fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Login
                </LoadingButton>
              </Stack>
            </form>
          </StyledContent>
          <p>{JSON.stringify(formik.values)}</p>
        </Container>
      </>
    </>
  );
}
