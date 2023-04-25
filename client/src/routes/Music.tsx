import PageLayout from "../components/PageLayout";

function Music() {
    return (
        <PageLayout>
            <iframe
                style={{ border: "none", borderRadius: 12, width: "100%", flexGrow: 1 }}
                src="https://open.spotify.com/embed/playlist/5HnOMBuzgmfW4X6TNdJles?utm_source=generator&theme=0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </PageLayout>
    );
}

export default Music;
