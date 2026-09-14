// Shared product catalog — static data only, no backend of any kind.
//
// images.secondary holds an optional per-finish editorial/lifestyle shot
// (filenames follow an e-<item number>-<finish>-secondary convention, e.g.
// e-1 = Item One) shown as a second PDP gallery slide.
// Left out entirely wherever that finish has no secondary shot yet — the PDP
// falls back to just the one pack-shot image rather than showing a
// mismatched or duplicate photo.
//
// illustration is one full-width painterly character illustration per item
// (finish-independent — the same piece of art regardless of gold/silver),
// shown at the bottom of that item's PDP.
const PRODUCTS = {
  one: {
    name: "Item One",
    sku: "E-1",
    price: 675,
    description:
      "Medallion necklace in {material} inspired by a favourite bedtime companion. Polished metal set with a scattering of gem buttons.",
    images: {
      silver: "assets/item-one-silver.png",
      gold: "assets/item-one-gold.png",
      secondary: {
        gold: "assets/e-1-gold-secondary.jpg",
      },
    },
    illustration: "assets/item-one-illustration.jpg",
  },
  two: {
    name: "Item Two",
    sku: "E-2",
    price: 675,
    description:
      "Medallion necklace in {material} with a hand-drawn face rendered in fine relief. Two faceted stones stand in for a pair of watchful eyes.",
    images: {
      silver: "assets/item-two-silver.png",
      gold: "assets/item-two-gold.png",
      secondary: {
        gold: "assets/e-2-gold-secondary.jpg",
        silver: "assets/e-2-silver-secondary.jpg",
      },
    },
    illustration: "assets/item-two-illustration.jpg",
  },
  three: {
    name: "Item Three",
    sku: "E-3",
    price: 675,
    description:
      "Medallion necklace in {material} with oversized ears cast in outline relief. Two square-cut stones catch the light with every step.",
    images: {
      silver: "assets/item-three-silver.png",
      gold: "assets/item-three-gold.png",
      secondary: {
        silver: "assets/e-3-silver-secondary.jpg",
      },
    },
    illustration: "assets/item-three-illustration.jpg",
  },
  four: {
    name: "Item Four",
    sku: "E-4",
    price: 675,
    description:
      "Medallion necklace in {material} with a lightweight, graphic chain. A dip on the disc makes for a subtly textured effect.",
    images: {
      silver: "assets/item-four-silver.png",
      gold: "assets/item-four-gold.png",
      secondary: {
        silver: "assets/e-4-silver-secondary.jpg",
      },
    },
    illustration: "assets/item-four-illustration.jpg",
  },
  five: {
    name: "Item Five",
    sku: "E-5",
    price: 675,
    description:
      "Medallion necklace in {material} with a soft, rounded silhouette. A quiet, sleepy face rendered in fine engraved line.",
    images: {
      silver: "assets/item-five-silver.png",
      gold: "assets/item-five-gold.png",
      secondary: {
        silver: "assets/e-5-silver-secondary.jpg",
      },
    },
    illustration: "assets/item-five-illustration.jpg",
  },
};

const MATERIAL_LABEL = {
  silver: "sterling silver",
  gold: "18k gold vermeil",
};
