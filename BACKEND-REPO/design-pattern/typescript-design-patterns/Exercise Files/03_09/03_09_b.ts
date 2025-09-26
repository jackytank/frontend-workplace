// Subsystem Class
abstract class Post  {
	abstract post() : void
}



class InstagramPost extends Post {

    post() : void {
        console.log(("Posting to Instagram")) 
    }
}

class TikTokPost extends Post {

    post() : void {
        console.log(("Posting to TikTok")) 
    }
}

class TwitterPost extends Post {

    post() : void {
        console.log(("Posting to Twitter")) 
    }
}

// Facade
class Publisher  {
	private instagram = new InstagramPost()
	private tikTok = new TikTokPost()
	private twitter = new TwitterPost()

    
    publish() : void {

    }
}

// Client
function publisherClient() {

}


publisherClient()