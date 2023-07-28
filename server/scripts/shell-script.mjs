#!/usr/bin/env zx


import { $ } from "zx";

var opsys = process.platform;

if (opsys == "win32" || opsys == "win64") {
    await $`mkdir uploads/hls, uploads/processed, uploads/videos, uploads/thumbnails`
} else if (opsys == "linux") {
    await $`mkdir -p uploads/hls uploads/processed uploads/videos uploads/thumbnails`
}
