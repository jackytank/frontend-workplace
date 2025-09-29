// Subsystem Class
abstract class Post {
    abstract post(): void;
}



class InstagramPost extends Post {

    post(): void {
        console.log(("Posting to Instagram"));
    }
}

class TikTokPost extends Post {

    post(): void {
        console.log(("Posting to TikTok"));
    }
}

class TwitterPost extends Post {

    post(): void {
        console.log(("Posting to Twitter"));
    }
}

// Facade
class Publisher {
    private readonly instagram = new InstagramPost();
    private readonly tikTok = new TikTokPost();
    private readonly twitter = new TwitterPost();

    publish(): void {
        this.instagram.post();
        this.tikTok.post();
        this.twitter.post();
    }
}

// Client
function publisherClient() {
    const publisher = new Publisher();
    publisher.publish();
}


publisherClient();