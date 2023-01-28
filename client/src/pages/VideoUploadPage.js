import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Stack,
  TextField,
  FormControl,
  Typography,
  Chip,
  Autocomplete,
} from "@mui/material";
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

      <>
        <Container>
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Upload video
            </Typography>
            <Stack spacing={3}>
              <TextField name="title" label="Video title" />
              <TextField name="description" label="Video description" />
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
              <TextField
                name="thumbnailUrl"
                label="Thumbnail URL"
                placeholder="Paste the image URL (temporary fix for now)"
              />
              <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                defaultValue={[]}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="freeSolo"
                    placeholder="Favorites"
                  />
                )}
              />
              {/* <TextField name="language" label="Language" /> */}
              {/** Language should be a select control and having options ["English", "Bangla", "Spanish", "Hindi", "Urdu"] */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Language</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={"English"}
                  label="Language"
                  onChange={handleChange}
                >
                  <MenuItem value={"English"}>English</MenuItem>
                  <MenuItem value={"Bangla"}>Bangla</MenuItem>
                  <MenuItem value={"Spanish"}>Spanish</MenuItem>
                  <MenuItem value={"Hindi"}>Hindi</MenuItem>
                  <MenuItem value={"Urdu"}>Urdu</MenuItem>
                </Select>
              </FormControl>
              {/* recordingDate should be a date picker */}
              <TextField
                id="date"
                label="Recording date"
                type="date"
                defaultValue={"10/10/2021"}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
      </>
    </>
  );
}
