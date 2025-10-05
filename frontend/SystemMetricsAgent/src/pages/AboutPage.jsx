import { Box, Typography, Container } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        mt={8}
        mb={8}
      >
        <Typography variant="h3" gutterBottom>
          About EventPulse
        </Typography>

        <Typography variant="h6" color="textSecondary" paragraph>
          EventPulse is a real-time event monitoring and recommendation system
          designed to help websites capture user interactions, analyze
          behaviors, and provide actionable insights. Our platform allows
          businesses to understand user activity instantly and make data-driven
          decisions.
        </Typography>

        <Typography variant="h6" color="textSecondary" paragraph>
          With EventPulse, you can track events like clicks, page navigation,
          form submissions, and more. The system integrates seamlessly with
          modern web technologies and provides a user-friendly dashboard to
          visualize metrics and trends.
        </Typography>

        <Typography variant="h6" color="textSecondary" paragraph>
          Our goal is to empower developers and businesses with powerful,
          real-time analytics without compromising performance or user privacy.
          EventPulse is optimized for high-traffic applications and scalable for
          future growth.
        </Typography>
      </Box>
    </Container>
  );
}
