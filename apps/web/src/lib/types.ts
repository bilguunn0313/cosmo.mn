import type {
  CountryCode,
  EmploymentType,
  JobDepartment,
  JobStage,
} from "@cosmo/shared";

export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
}

export interface Admin extends AuthAdmin {
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type MediaType = "IMAGE" | "VIDEO";

export interface Media {
  id: number;
  type: MediaType;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  focusX: number;
  focusY: number;
  zoom: number;
  createdAt: string;
}

export type MediaUsageType =
  | "slide"
  | "brand"
  | "brandSection"
  | "product"
  | "section"
  | "milestone"
  | "retailPartner"
  | "news"
  | "siteSetting";

export type Locale = "mn" | "en" | "zh";

export interface Slide {
  id: number;
  mediaId: number;
  media: Media;
  posterId: number | null;
  poster: Media | null;
  order: number;
  isActive: boolean;
}

export type SectionPage = "home" | "about" | "human-resources";

export interface SectionTranslation {
  id: number;
  locale: Locale;
  title: string;
  body: string;
}

export interface Section {
  id: number;
  imageId: number | null;
  image: Media | null;
  linkUrl?: string | null;
  order: number;
  isVisible: boolean;
  translations: SectionTranslation[];
}

export interface MilestoneTranslation {
  id: number;
  locale: Locale;
  title: string;
  description: string | null;
}

export interface Milestone {
  id: number;
  year: number;
  imageId: number | null;
  image: Media | null;
  isVisible: boolean;
  translations: MilestoneTranslation[];
}

export interface RetailPartner {
  id: number;
  name: string;
  logoId: number;
  logo: Media;
  order: number;
  isVisible: boolean;
}

export type BrandCategory = "FOOD" | "BEAUTY" | "HOUSEHOLD";

export interface BrandTranslation {
  id: number;
  locale: Locale;
  name: string;
  summary: string | null;
  productTypes: string | null;
}

export interface Brand {
  id: number;
  slug: string;
  categories: BrandCategory[];
  logoId: number | null;
  logo: Media | null;
  coverId: number | null;
  cover: Media | null;
  showcaseImageId: number | null;
  showcaseImage: Media | null;
  websiteUrl: string | null;
  originCountry: CountryCode | null;
  order: number;
  featuredOrder: number | null;
  isPublished: boolean;
  translations: BrandTranslation[];
}

export interface ProductTranslation {
  id: number;
  locale: Locale;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  brandId: number;
  imageId: number;
  image: Media;
  order: number;
  isVisible: boolean;
  translations: ProductTranslation[];
}

export interface NewsTranslation {
  id: number;
  locale: Locale;
  title: string;
  summary: string | null;
  content: string;
}

export interface News {
  id: number;
  slug: string;
  coverImageId: number | null;
  coverImage: Media | null;
  videoId: number | null;
  video: Media | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  translations: NewsTranslation[];
}

export interface SiteSettingTranslation {
  id: number;
  locale: Locale;
  address: string | null;
  workingHours: string | null;
}

export interface SiteSetting {
  id: number;
  phone: string | null;
  email: string | null;
  hrEmail: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  mapUrl: string | null;
  mapEmbedUrl: string | null;
  mapImageId: number | null;
  mapImage: Media | null;
  aboutBannerImageId: number | null;
  aboutBannerImage: Media | null;
  careersBannerImageId: number | null;
  careersBannerImage: Media | null;
  mediaBannerImageId: number | null;
  mediaBannerImage: Media | null;
  brandsBannerImageId: number | null;
  brandsBannerImage: Media | null;
  contactBannerImageId: number | null;
  contactBannerImage: Media | null;
  hrGovernanceImageId: number | null;
  hrGovernanceImage: Media | null;
  hrJobsImageId: number | null;
  hrJobsImage: Media | null;
  ceoImageId: number | null;
  ceoImage: Media | null;
  valuePeopleImageId: number | null;
  valuePeopleImage: Media | null;
  valueSatisfactionImageId: number | null;
  valueSatisfactionImage: Media | null;
  valueQualityImageId: number | null;
  valueQualityImage: Media | null;
  valueResponsibilityImageId: number | null;
  valueResponsibilityImage: Media | null;
  homeAboutImageId: number | null;
  homeAboutImage: Media | null;
  foundedYear: number | null;
  employeeCount: number | null;
  salesPointCount: number | null;
  productCount: number | null;
  updatedAt: string;
  translations: SiteSettingTranslation[];
}

export interface ContactDepartmentTranslation {
  id: number;
  locale: Locale;
  name: string;
}

export interface ContactDepartment {
  id: number;
  email: string;
  order: number;
  isActive: boolean;
  translations: ContactDepartmentTranslation[];
}

export interface MediaUsage {
  type: MediaUsageType;
  id: number;
  title: string;
}

export interface JobPostingTranslation {
  id: number;
  locale: Locale;
  title: string;
  location: string | null;
  salary: string | null;
  summary: string | null;
  duties: string | null;
  requirements: string | null;
  offers: string | null;
}

export interface JobPosting {
  id: number;
  slug: string;
  department: JobDepartment;
  employmentType: EmploymentType;
  stage: JobStage;
  openedAt: string;
  closesAt: string | null;
  isPublished: boolean;
  translations: JobPostingTranslation[];
}
