import React from "react";
import "./styles/SkeletonLoading.css";
import { Box, Grid, Skeleton } from "@mui/material";

const SkeletonLoading = () => {
  const generateSkeletonItems = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
        <Box className="div-skeleton-container">
          <Skeleton variant="rectangular" className="skeleton-loading-img-box" />
          <Skeleton className="skeleton-text-name" />
          <Box className="div-skeleton-genre-platform">
            <Skeleton className="skeleton-genre-platform" />
            <Skeleton className="skeleton-genre-platform" />
            <Skeleton className="skeleton-genre-platform" />
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Box className="div-skeleton-loading-parent">
      <Grid container spacing={2}>
        {generateSkeletonItems(20)}
      </Grid>
    </Box>
  );
};

export default SkeletonLoading;
