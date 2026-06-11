import { Bar, BarSlug } from "@/types";

export const BARS: Bar[] = [
  {
    slug: "sou",
    name: "Bar Sou",
    shortName: "Sou",
    area: "那覇市松山",
    description:
      "那覇の夜を彩るシグネチャーカクテルで知られるBar Sou。熟練バーテンダーが一杯一杯丁寧に仕上げる、大人のための空間です。",
    address: "沖縄県那覇市松山2丁目",
    hours: "20:00〜翌3:00",
    closedDays: "日曜日",
    instagram: "https://www.instagram.com/bar_sou/",
    googleMapUrl: "https://maps.google.com/?q=Bar+Sou+那覇",
    cocktails: [
      {
        name: "Sou Signature",
        description: "琉球泡盛をベースにした店舗オリジナルカクテル。",
      },
      {
        name: "Okinawa Negroni",
        description: "沖縄の柑橘を使ったアレンジネグローニ。",
      },
      {
        name: "Coral Sunset",
        description: "美しいサンセットを表現したトロピカルカクテル。",
      },
    ],
  },
  {
    slug: "daisy",
    name: "Bar Daisy",
    shortName: "Daisy",
    area: "那覇市久茂地",
    description:
      "クラシックカクテルと独創的なオリジナルの融合。Bar Daisyは知る人ぞ知る那覇の名店。落ち着いた雰囲気と確かな技術が光ります。",
    address: "沖縄県那覇市久茂地3丁目",
    hours: "19:00〜翌2:00",
    closedDays: "月曜日",
    instagram: "https://www.instagram.com/bar_daisy_naha/",
    googleMapUrl: "https://maps.google.com/?q=Bar+Daisy+那覇",
    cocktails: [
      {
        name: "Daisy Classic",
        description: "定番のデイジーを Bar Daisy 流にアレンジ。",
      },
      {
        name: "Hibiscus Fizz",
        description: "ハイビスカスの香りが爽やかなスパークリングカクテル。",
      },
      {
        name: "Ryukyu Old Fashioned",
        description: "泡盛を使った琉球風オールドファッションド。",
      },
    ],
  },
  {
    slug: "stir",
    name: "Bar Stir Laboratory",
    shortName: "Stir Lab",
    area: "那覇市栄町",
    description:
      "カクテルを科学する実験的な一軒。Bar Stir Laboratoryでは、見た目にも美しい創作カクテルを楽しめます。",
    address: "沖縄県那覇市栄町",
    hours: "20:00〜翌3:00",
    closedDays: "火曜日",
    googleMapUrl: "https://maps.google.com/?q=Bar+Stir+Laboratory+那覇",
    cocktails: [
      {
        name: "Lab Experiment No.7",
        description: "煙と泡で演出する実験的なカクテル。",
      },
      {
        name: "Crystal Clear",
        description: "透明感を追求したクリアなジン&トニック。",
      },
      {
        name: "Molecular Spritz",
        description: "分子調理技術を取り入れた革新的なスプリッツ。",
      },
    ],
  },
  {
    slug: "hammock",
    name: "Bar Hammock",
    shortName: "Hammock",
    area: "那覇市牧志",
    description:
      "ハンモックに揺られるような心地よさをカクテルで。Bar Hammockはゆったりとした時間が流れる、隠れ家的なバーです。",
    address: "沖縄県那覇市牧志2丁目",
    hours: "19:00〜翌2:00",
    closedDays: "水曜日",
    instagram: "https://www.instagram.com/bar_hammock_naha/",
    googleMapUrl: "https://maps.google.com/?q=Bar+Hammock+那覇",
    cocktails: [
      {
        name: "Hammock Breeze",
        description: "南国の風を感じるトロピカルカクテル。",
      },
      {
        name: "Island Sour",
        description: "シークワーサーを使ったさっぱりサワー。",
      },
      {
        name: "Stargazer",
        description: "夜空を映したような深い青のカクテル。",
      },
    ],
  },
  {
    slug: "fortuna",
    name: "BAR FORTUNA",
    shortName: "FORTUNA",
    area: "那覇市松山",
    description:
      "幸運を呼ぶバー。BAR FORTUNAは上質なスピリッツと本格的なバーフードで、特別な夜を演出します。",
    address: "沖縄県那覇市松山1丁目",
    hours: "20:00〜翌4:00",
    closedDays: "なし",
    instagram: "https://www.instagram.com/bar_fortuna_naha/",
    googleMapUrl: "https://maps.google.com/?q=BAR+FORTUNA+那覇",
    cocktails: [
      {
        name: "Fortuna Special",
        description: "幸運を願うシグネチャーカクテル。",
      },
      {
        name: "Golden Hour",
        description: "ゴールドカラーの美しいサンダウナー。",
      },
      {
        name: "Lucky Clover",
        description: "ハーブを効かせた爽やかなカクテル。",
      },
    ],
  },
  {
    slug: "whisky-japan",
    name: "Bar Whisky&JAPAN",
    shortName: "Whisky&JAPAN",
    area: "那覇市泉崎",
    description:
      "日本のウイスキー文化を深く掘り下げるBar Whisky&JAPAN。豊富なジャパニーズウイスキーのラインナップと、こだわりのカクテルが揃います。",
    address: "沖縄県那覇市泉崎1丁目",
    hours: "19:00〜翌2:00",
    closedDays: "日曜日",
    googleMapUrl: "https://maps.google.com/?q=Bar+Whisky+JAPAN+那覇",
    cocktails: [
      {
        name: "Highball Premium",
        description: "厳選ジャパニーズウイスキーのプレミアムハイボール。",
      },
      {
        name: "Wa Sour",
        description: "和の素材を使ったウイスキーサワー。",
      },
      {
        name: "Mizunara Smoked",
        description: "水楢チップで燻したスモーキーカクテル。",
      },
    ],
  },
];

export const BAR_SLUGS: BarSlug[] = BARS.map((b) => b.slug) as BarSlug[];

export function isValidBarSlug(slug: string): slug is BarSlug {
  return (BAR_SLUGS as string[]).includes(slug);
}

export function getBar(slug: string): Bar | undefined {
  return BARS.find((b) => b.slug === slug);
}
