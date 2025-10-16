import {
  Body,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmail {
  username: string;
  otp: string;
}
export default function VerificationEmail({
  username,
  otp,
}: VerificationEmail) {
  return (
    <Html>
      <Head>
        <title>Verification Email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body>
        <Preview>Heres' your verification code :{otp}</Preview>
        <Section>
          <Row>
            <Heading>Hello {username}</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text>{otp}</Text>
          </Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Section>
      </Body>
    </Html>
  );
}
