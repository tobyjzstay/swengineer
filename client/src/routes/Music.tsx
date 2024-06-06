import PageLayout from "../components/PageLayout";
import "./Music.scss";

function Music() {
    return (
        <PageLayout>
            <iframe
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="music-layout"
                loading="lazy"
                src="https://open.spotify.com/embed/playlist/5HnOMBuzgmfW4X6TNdJles?utm_source=generator&theme=0"
            />
        </PageLayout>
    );
}

export default Music;
