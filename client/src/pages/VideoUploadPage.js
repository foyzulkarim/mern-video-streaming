import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Container, Stack, TextField, FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { LoadingButton } from "@mui/lab";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/logo";
// sections

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

/**
 *  Create a MUI form to save below video properties: 
    title, description, videoLink, fileName, visibility, 
    thumbnailUrl, playlistId, tags, language, recordingDate, 
    category, viewsCount, likesCount, dislikesCount, 
 */

export default function VideoUploadPage() {
  const handleClick = () => {
    console.log("clicked");
  };

  const handleChange = (event) => {
    console.log("changed", event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Video upload</title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: "fixed",
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        <Container maxWidth="sm">
          <StyledContent>
            <Stack spacing={3}>
              <TextField name="title" label="Video title" />
              <TextField name="description" label="Video description" />
              <TextField name="fileName" label="File name" />
              {/* visibility should be a select field with options: public, private, unlisted */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Visibility
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={"public"}
                  label="Visibility"
                  onChange={handleChange}
                >
                  <MenuItem value={"public"}>Public</MenuItem>
                  <MenuItem value={"private"}>Private</MenuItem>
                  <MenuItem value={"unlisted"}>Unlisted</MenuItem>
                </Select>
              </FormControl>
              <TextField name="thumbnailUrl" label="Thumbnail URL" />
              <TextField name="playlistId" label="Playlist ID" />
              <TextField name="tags" label="Tags" />
              <TextField name="language" label="Language" />
              <TextField name="recordingDate" label="Recording date" />
              <TextField name="category" label="Category" />
              <TextField name="viewsCount" label="Views count" />
              <TextField name="likesCount" label="Likes count" />
              <TextField name="dislikesCount" label="Dislikes count" />
              <LoadingButton
                //fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleClick}
              >
                Login
              </LoadingButton>
            </Stack>

            <Stack spacing={3}></Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
