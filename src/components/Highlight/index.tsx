import { Container, Title, Subtitle } from "./styles";

type Props = {
    title: String;
    subtitle: String;
}
export function Highlight({title, subtitle}: Props){
    return(
        <Container>
            <Title>
                {title}
            </Title>
            <Subtitle>
                {subtitle}
            </Subtitle>
        </Container>
    );
};