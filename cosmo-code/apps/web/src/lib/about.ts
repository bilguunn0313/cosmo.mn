/**
 * Static About-page content. Move into the admin (site settings / sections)
 * when ready; the components only read these shapes.
 */

export const ABOUT_BANNER_IMAGE: string | null = null; // e.g. "/images/about/building.jpg"

export interface CeoMessage {
  quote: string;
  body: string;
  name: string;
  role: string;
  imageUrl: string | null;
}

export const CEO_MESSAGE: CeoMessage = {
  quote: "Захирлын мэндчилгээний.",
  body: "Мэндчилгээний үргэлжлэл: компанийн алсын хараа, хамт олон, харилцагчдад хандсан үг.",
  name: "Овог Нэр",
  role: "Гүйцэтгэх захирал",
  imageUrl: null,
};

export interface Award {
  count: string;
  label: string;
}

export const AWARDS: Award[] = [
  { count: "7×", label: "Шилдэг татвар төлөгч" },
  { count: "3×", label: "“ТОП-100” аж ахуйн нэгж" },
  { count: "2×", label: "“ТОП-150” аж ахуйн нэгж" },
];

export interface CompanyValue {
  title: string;
  description: string;
  imageUrl: string | null;
}

export const VALUES: CompanyValue[] = [
  {
    title: "Хүн",
    description:
      "Бид хүсэл тэмүүлэлтэй, хамт олонч ажиллах орчныг бий болгохыг зорьж ажилладаг.",
    imageUrl: null,
  },
  {
    title: "Сэтгэл ханамж",
    description:
      "Бид хэрэглэгч болон харилцагчдынхаа сэтгэл ханамжийг дээдэлдэг.",
    imageUrl: null,
  },
  {
    title: "Чанар",
    description:
      "Бид агуулах, хадгалалт, түгээлтийн олон улсын стандартыг өдөр тутмын үйл ажиллагаандаа мөрддөг.",
    imageUrl: null,
  },
  {
    title: "Нийгмийн хариуцлага",
    description:
      "Бид бүхий л үйл ажиллагаандаа хууль, ёс зүйг эрхэмлэж нийгмийн хариуцлагатай байгууллага байхыг зорьдог.",
    imageUrl: null,
  },
];
