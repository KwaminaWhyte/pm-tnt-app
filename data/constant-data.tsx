import { UserOutlined } from "@/components/icons/auth"
import { HeartOutlined } from "@/components/icons/profile"
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons"

export const benefits = [
    {
        icon: (
            <MaterialIcons name='health-and-safety' size={30} color='#eab308' />
        ),
        title: "Safety Insured",
        description: "Your well-being is our top priority.",
    },
    {
        icon: <MaterialIcons name='headset-mic' size={30} color='#eab308' />,
        title: "24/7 Help & Support",
        description: "We’re readily available to respond to you.",
    },
    {
        icon: (
            <MaterialCommunityIcons
                name='airplane-marker'
                size={30}
                color='#eab308'
            />
        ),
        title: "Customized Travel Experiences",
        description: "Tailored trips that match your interests.",
    },
]

export const carouselItems = [
    {
        bannerImage: "https://source.unsplash.com/featured/?paris",
        title: "Romantic Paris Getaway",
        description: "Experience the magic of Paris with exclusive offers.",
        cta: { label: "Book Now", onPress: () => alert("Booking Paris") },
    },
    {
        bannerImage: "https://source.unsplash.com/featured/?bali",
        title: "Tropical Bali Escape",
        description: "Relax on pristine beaches with our Bali package.",
        cta: { label: "Explore", onPress: () => alert("Exploring Bali") },
    },
    {
        bannerImage: "https://source.unsplash.com/featured/?safari",
        title: "African Safari Adventure",
        description: "Discover the wild with an exciting safari.",
        cta: { label: "Join Safari", onPress: () => alert("Joining Safari") },
    },
]

export const galleryItems = [
    {
        id: 1,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
    {
        id: 2,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
    {
        id: 3,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
    {
        id: 4,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
    {
        id: 5,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
    {
        id: 6,
        src: "https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
    },
]

// profile settings
export const profileSettings = [
    {
        title: "Account",
        items: [
            {
                icon: (
                    <Ionicons
                        name='person-outline'
                        size={20}
                        color={"#eab308"}
                    />
                ),
                label: "Edit Profile",
                handlePress: () => console.log("edit profile"),
            },
            {
                icon: (
                    <Ionicons
                        name='heart-outline'
                        color={"#eab308"}
                        size={20}
                    />
                ),
                label: "Wishlist",
                handlePress: () => console.log("wishlist"),
            },
        ],
    },
    {
        title: "Company",
        items: [
            {
                icon: (
                    <Ionicons name='book-outline' size={20} color={"#eab308"} />
                ),
                label: "Privacy Policy",
                handlePress: () => console.log("privacy policy"),
            },
            {
                icon: (
                    <Ionicons
                        name='bookmark-outline'
                        color={"#eab308"}
                        size={20}
                    />
                ),
                label: "Terms & Conditions",
                handlePress: () => console.log("t&c"),
            },
        ],
    },
]
