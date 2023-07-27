const electron = require("electron");
const events = new require("events");
const darwin = (process.platform == "darwin");
const menus = [];
const chat_menus = [];
const font_names = [];
const font_list = {
    "Custom": { "TOPAZ 437": 16, "TES-SYM5": 16, "TES-GIGR": 16, "GJSCI-3": 16, "GJSCI-4": 16, "GJSCI-X": 16, "FROGBLOCK": 8 },
    "Amiga": { "Amiga Topaz 1": 16, "Amiga Topaz 1+": 16, "Amiga Topaz 2": 16, "Amiga Topaz 2+": 16, "Amiga P0T-NOoDLE": 16, "Amiga MicroKnight": 16, "Amiga MicroKnight+": 16, "Amiga mOsOul": 16 },
    "Arabic": { "IBM VGA50 864": 8, "IBM EGA 864": 14, "IBM VGA 864": 16 },
    "Baltic Rim": { "IBM VGA50 775": 8, "IBM EGA 775": 14, "IBM VGA 775": 16 },
    "C64": { "C64 PETSCII unshifted": 8, "C64 PETSCII shifted": 8 },
    "Cyrillic": { "IBM VGA50 866": 8, "IBM EGA 866": 14, "IBM VGA 866": 16, "IBM VGA50 855": 8, "IBM EGA 855": 14, "IBM VGA 855": 16 },
    "French Canadian": { "IBM VGA50 863": 8, "IBM EGA 863": 14, "IBM VGA 863": 16, "IBM VGA25G 863": 19 },
    "Greek": { "IBM VGA50 737": 8, "IBM EGA 737": 14, "IBM VGA 737": 16, "IBM VGA50 869": 8, "IBM EGA 869": 14, "IBM VGA 869": 16, "IBM VGA50 851": 8, "IBM EGA 851": 14, "IBM VGA 851": 16, "IBM VGA25G 851": 19 },
    "Hebrew": { "IBM VGA50 862": 8, "IBM EGA 862": 14, "IBM VGA 862": 16 },
    "IBM PC": { "IBM VGA50": 8, "IBM EGA": 14, "IBM VGA": 16, "IBM VGA25G": 19 },
    "Icelandic": { "IBM VGA50 861": 8, "IBM EGA 861": 14, "IBM VGA 861": 16, "IBM VGA25G 861": 19 },
    "Latin-1 Western European": { "IBM VGA50 850": 8, "IBM EGA 850": 14, "IBM VGA 850": 16, "IBM VGA25G 850": 19 },
    "Latin-1 Central European": { "IBM VGA50 852": 8, "IBM EGA 852": 14, "IBM VGA 852": 16, "IBM VGA25G 852": 19 },
    "Latin-1 Multilingual": { "IBM VGA50 853": 8, "IBM EGA 853": 14, "IBM VGA 853": 16, "IBM VGA25G 853": 19 },
    "Nordic": { "IBM VGA50 865": 8, "IBM EGA 865": 14, "IBM VGA 865": 16, "IBM VGA25G 865": 19 },
    "Portuguese": { "IBM VGA50 860": 8, "IBM EGA 860": 14, "IBM VGA 860": 16, "IBM VGA25G 860": 19 },
    "Turkish": { "IBM VGA50 857": 8, "IBM EGA 857": 14, "IBM VGA 857": 16 }
};
const viler_font_list = {
    "UNSCII": { "THIN (8x8)": 8, "THIN_RUS (8x8)": 8, "THIN_LT2 (8x8)": 8, "THIN_LT1 (8x8)": 8, "THIN_HEB (8x8)": 8, "THIN_GRE (8x8)": 8, "THIN_GFX (8x8)": 8, "THIN_CYR (8x8)": 8, "TALL (8x16)": 16, "TALL_RUS (8x16)": 16, "TALL_LT2 (8x16)": 16, "TALL_LT1 (8x16)": 16, "TALL_HEB (8x16)": 16, "TALL_GRE (8x16)": 16, "TALL_GFX (8x16)": 16, "TALL_CYR (8x16)": 16, "MCR (8x8)": 8, "MCR_RUS (8x8)": 8, "MCR_LT2 (8x8)": 8, "MCR_LT1 (8x8)": 8, "MCR_HEB (8x8)": 8, "MCR_GRE (8x8)": 8, "MCR_GFX (8x8)": 8, "MCR_CYR (8x8)": 8, "FANT (8x8)": 8, "FANT_RUS (8x8)": 8, "FANT_LT2 (8x8)": 8, "FANT_LT1 (8x8)": 8, "FANT_HEB (8x8)": 8, "FANT_GRE (8x8)": 8, "FANT_GFX (8x8)": 8, "FANT_CYR (8x8)": 8, "ALT8 (8x8)": 8, "ALT8_RUS (8x8)": 8, "ALT8_LT2 (8x8)": 8, "ALT8_LT1 (8x8)": 8, "ALT8_HEB (8x8)": 8, "ALT8_GRE (8x8)": 8, "ALT8_GFX (8x8)": 8, "ALT8_CYR (8x8)": 8, "16 (8x16)": 16, "16_RUS (8x16)": 16, "16_LT2 (8x16)": 16, "16_LT1 (8x16)": 16, "16_HEB (8x16)": 16, "16_GRE (8x16)": 16, "16_GFX (8x16)": 16, "16_CYR (8x16)": 16, "8 (8x8)": 8, "8_RUS (8x8)": 8, "8_LT2 (8x8)": 8, "8_LT1 (8x8)": 8, "8_HEB (8x8)": 8, "8_GRE (8x8)": 8, "8_GFX (8x8)": 8, "8_CYR (8x8)": 8 },
    "PCDOS2K": { "KR-DOS (8x16)": 16, "J700C-V (8x19)": 19, "J700C-V (8x16)": 16, "ISOCP869 (8x16)": 16, "ISOCP866 (8x16)": 16, "ISOCP863 (8x16)": 16, "ISOCP861 (8x16)": 16, "ISOCP860 (8x16)": 16, "ISOCP857 (8x16)": 16, "ISOCP855 (8x16)": 16, "ISOCP852 (8x16)": 16, "ISOCP850 (8x16)": 16, "ISOCP437 (8x16)": 16, "CP915 (8x16)": 16, "CP915 (8x14)": 14, "CP915 (8x8)": 8, "CP912 (8x16)": 16, "CP912 (8x14)": 14, "CP912 (8x8)": 8, "CP869 (8x16)": 16, "CP869 (8x14)": 14, "CP869 (8x8)": 8, "CP866 (8x16)": 16, "CP866 (8x14)": 14, "CP866 (8x8)": 8, "CP865 (8x16)": 16, "CP865 (8x14)": 14, "CP865 (8x8)": 8, "CP863 (8x16)": 16, "CP863 (8x14)": 14, "CP863 (8x8)": 8, "CP861 (8x16)": 16, "CP861 (8x14)": 14, "CP861 (8x8)": 8, "CP860 (8x16)": 16, "CP860 (8x14)": 14, "CP860 (8x8)": 8, "CP857 (8x16)": 16, "CP857 (8x14)": 14, "CP857 (8x8)": 8, "CP855 (8x16)": 16, "CP855 (8x14)": 14, "CP855 (8x8)": 8, "CP852 (8x16)": 16, "CP852 (8x14)": 14, "CP852 (8x8)": 8, "CP850 (8x16)": 16, "CP850 (8x14)": 14, "CP850 (8x8)": 8, "CP437 (8x16)": 16, "CP437 (8x14)": 14, "CP437 (8x8)": 8, "CN-TWNHN (8x19)": 19, "CN-TWNHN (8x16)": 16, "CN-TW437 (8x19)": 19, "CN-TW437 (8x16)": 16, "CN-PRCHN (8x19)": 19, "CN-PRCHN (8x16)": 16 },
    "OS2": { "874_THA (8x18)": 18, "874_THA (8x16)": 16, "874_THA (8x14)": 14, "874_THA (8x12)": 12, "874_THA (8x10)": 10, "874_THA (8x8)": 8, "866_RUS (8x18)": 18, "866_RUS (8x16)": 16, "866_RUS (8x14)": 14, "866_RUS (8x12)": 12, "866_RUS (8x10)": 10, "866_RUS (8x8)": 8, "864_ARA (8x18)": 18, "864_ARA (8x16)": 16, "864_ARA (8x14)": 14, "864_ARA (8x12)": 12, "864_ARA (8x10)": 10, "864_ARA (8x8)": 8, "862_HEB (8x18)": 18, "862_HEB (8x16)": 16, "862_HEB (8x14)": 14, "862_HEB (8x12)": 12, "862_HEB (8x10)": 10, "862_HEB (8x8)": 8, "855_CYR (8x18)": 18, "855_CYR (8x16)": 16, "855_CYR (8x14)": 14, "855_CYR (8x12)": 12, "855_CYR (8x10)": 10, "855_CYR (8x8)": 8, "852_LAT2 (8x18)": 18, "852_LAT2 (8x16)": 16, "852_LAT2 (8x14)": 14, "852_LAT2 (8x12)": 12, "852_LAT2 (8x10)": 10, "852_LAT2 (8x8)": 8, "850_LAT1 (8x18)": 18, "850_LAT1 (8x16)": 16, "850_LAT1 (8x14)": 14, "850_LAT1 (8x12)": 12, "850_LAT1 (8x10)": 10, "850_LAT1 (8x8)": 8, "737_GRE (8x18)": 18, "737_GRE (8x16)": 16, "737_GRE (8x14)": 14, "737_GRE (8x12)": 12, "737_GRE (8x10)": 10, "737_GRE (8x8)": 8, "437_US (8x18)": 18, "437_US (8x16)": 16, "437_US (8x14)": 14, "437_US (8x12)": 12, "437_US (8x10)": 10, "437_US (8x8)": 8 },
    "OLIDOS33": { "OLI-D-T8 (8x14)": 14, "OLI-D-T9 (8x16)": 16, "OLI-D-T9 (8x14)": 14, "OLI-D-T8 (8x16)": 16 },
    "CPIWIN12": { "CP65506 (8x16)": 16, "CP65506 (8x14)": 14, "CP65506 (8x8)": 8, "CP62691 (8x16)": 16, "CP62691 (8x14)": 14, "CP62691 (8x8)": 8, "CP61667 (8x16)": 16, "CP61667 (8x14)": 14, "CP61667 (8x8)": 8, "CP60643 (8x16)": 16, "CP60643 (8x14)": 14, "CP60643 (8x8)": 8, "CP59620 (8x16)": 16, "CP59620 (8x14)": 14, "CP59620 (8x8)": 8, "CP59619 (8x16)": 16, "CP59619 (8x14)": 14, "CP59619 (8x8)": 8, "CP58601 (8x16)": 16, "CP58601 (8x14)": 14, "CP58601 (8x8)": 8, "CP58598 (8x16)": 16, "CP58598 (8x14)": 14, "CP58598 (8x8)": 8, "CP58596 (8x16)": 16, "CP58596 (8x14)": 14, "CP58596 (8x8)": 8, "CP58595 (8x16)": 16, "CP58595 (8x14)": 14, "CP58595 (8x8)": 8, "CP1361 (8x16)": 16, "CP1361 (8x14)": 14, "CP1361 (8x8)": 8, "CP1270 (8x16)": 16, "CP1270 (8x14)": 14, "CP1270 (8x8)": 8, "CP1257 (8x16)": 16, "CP1257 (8x14)": 14, "CP1257 (8x8)": 8, "CP1254 (8x16)": 16, "CP1254 (8x14)": 14, "CP1254 (8x8)": 8, "CP1253 (8x16)": 16, "CP1253 (8x14)": 14, "CP1253 (8x8)": 8, "CP1252 (8x16)": 16, "CP1252 (8x14)": 14, "CP1252 (8x8)": 8, "CP1251 (8x16)": 16, "CP1251 (8x14)": 14, "CP1251 (8x8)": 8, "CP1250 (8x16)": 16, "CP1250 (8x14)": 14, "CP1250 (8x8)": 8 },
    "CPIMSC12": { "CP65505 (8x16)": 16, "CP65505 (8x14)": 14, "CP65505 (8x8)": 8, "CP62259 (8x16)": 16, "CP62259 (8x14)": 14, "CP62259 (8x8)": 8, "CP1288 (8x16)": 16, "CP1288 (8x14)": 14, "CP1288 (8x8)": 8, "CP1287 (8x16)": 16, "CP1287 (8x14)": 14, "CP1287 (8x8)": 8, "CP1051 (8x16)": 16, "CP1051 (8x14)": 14, "CP1051 (8x8)": 8 },
    "CPIMAC12": { "CP58630 (8x16)": 16, "CP58630 (8x14)": 14, "CP58630 (8x8)": 8, "CP58627 (8x16)": 16, "CP58627 (8x14)": 14, "CP58627 (8x8)": 8, "CP58619 (8x16)": 16, "CP58619 (8x14)": 14, "CP58619 (8x8)": 8, "CP1286 (8x16)": 16, "CP1286 (8x14)": 14, "CP1286 (8x8)": 8, "CP1285 (8x16)": 16, "CP1285 (8x14)": 14, "CP1285 (8x8)": 8, "CP1284 (8x16)": 16, "CP1284 (8x14)": 14, "CP1284 (8x8)": 8, "CP1283 (8x16)": 16, "CP1283 (8x14)": 14, "CP1283 (8x8)": 8, "CP1282 (8x16)": 16, "CP1282 (8x14)": 14, "CP1282 (8x8)": 8, "CP1281 (8x16)": 16, "CP1281 (8x14)": 14, "CP1281 (8x8)": 8, "CP1280 (8x16)": 16, "CP1280 (8x14)": 14, "CP1280 (8x8)": 8, "CP1275 (8x16)": 16, "CP1275 (8x14)": 14, "CP1275 (8x8)": 8 },
    "CPIKOI12": { "CP63342 (8x16)": 16, "CP63342 (8x14)": 14, "CP63342 (8x8)": 8, "CP62318 (8x16)": 16, "CP62318 (8x14)": 14, "CP62318 (8x8)": 8, "CP61294 (8x16)": 16, "CP61294 (8x14)": 14, "CP61294 (8x8)": 8, "CP60270 (8x16)": 16, "CP60270 (8x14)": 14, "CP60270 (8x8)": 8, "CP59246 (8x16)": 16, "CP59246 (8x14)": 14, "CP59246 (8x8)": 8, "CP58222 (8x16)": 16, "CP58222 (8x14)": 14, "CP58222 (8x8)": 8, "CP878 (8x16)": 16, "CP878 (8x14)": 14, "CP878 (8x8)": 8 },
    "CPIISO12": { "CP65504 (8x16)": 16, "CP65504 (8x14)": 14, "CP65504 (8x8)": 8, "CP65503 (8x16)": 16, "CP65503 (8x14)": 14, "CP65503 (8x8)": 8, "CP65502 (8x16)": 16, "CP65502 (8x14)": 14, "CP65502 (8x8)": 8, "CP65501 (8x16)": 16, "CP65501 (8x14)": 14, "CP65501 (8x8)": 8, "CP65500 (8x16)": 16, "CP65500 (8x14)": 14, "CP65500 (8x8)": 8, "CP63283 (8x16)": 16, "CP63283 (8x14)": 14, "CP63283 (8x8)": 8, "CP61235 (8x16)": 16, "CP61235 (8x14)": 14, "CP61235 (8x8)": 8, "CP60211 (8x16)": 16, "CP60211 (8x14)": 14, "CP60211 (8x8)": 8, "CP59283 (8x16)": 16, "CP59283 (8x14)": 14, "CP59283 (8x8)": 8, "CP59187 (8x16)": 16, "CP59187 (8x14)": 14, "CP59187 (8x8)": 8, "CP58259 (8x16)": 16, "CP58259 (8x14)": 14, "CP58259 (8x8)": 8, "CP58258 (8x16)": 16, "CP58258 (8x14)": 14, "CP58258 (8x8)": 8, "CP58163 (8x16)": 16, "CP58163 (8x14)": 14, "CP58163 (8x8)": 8, "CP1124 (8x16)": 16, "CP1124 (8x14)": 14, "CP1124 (8x8)": 8, "CP923 (8x16)": 16, "CP923 (8x14)": 14, "CP923 (8x8)": 8, "CP922 (8x16)": 16, "CP922 (8x14)": 14, "CP922 (8x8)": 8, "CP921 (8x16)": 16, "CP921 (8x14)": 14, "CP921 (8x8)": 8, "CP920 (8x16)": 16, "CP920 (8x14)": 14, "CP920 (8x8)": 8, "CP919 (8x16)": 16, "CP919 (8x14)": 14, "CP919 (8x8)": 8, "CP915 (8x16)": 16, "CP915 (8x14)": 14, "CP915 (8x8)": 8, "CP914 (8x16)": 16, "CP914 (8x14)": 14, "CP914 (8x8)": 8, "CP913 (8x16)": 16, "CP913 (8x14)": 14, "CP913 (8x8)": 8, "CP912 (8x16)": 16, "CP912 (8x14)": 14, "CP912 (8x8)": 8, "CP902 (8x16)": 16, "CP902 (8x14)": 14, "CP902 (8x8)": 8, "CP901 (8x16)": 16, "CP901 (8x14)": 14, "CP901 (8x8)": 8, "CP819 (8x16)": 16, "CP819 (8x14)": 14, "CP819 (8x8)": 8, "CP813 (8x16)": 16, "CP813 (8x14)": 14, "CP813 (8x8)": 8 },
    "CPIDOS30": { "CP62306 (8x16)": 16, "CP62306 (8x14)": 14, "CP62306 (8x8)": 8, "CP60853 (8x16)": 16, "CP60853 (8x14)": 14, "CP60853 (8x8)": 8, "CP60258 (8x16)": 16, "CP60258 (8x14)": 14, "CP60258 (8x8)": 8, "CP59829 (8x16)": 16, "CP59829 (8x14)": 14, "CP59829 (8x8)": 8, "CP59234 (8x16)": 16, "CP59234 (8x14)": 14, "CP59234 (8x8)": 8, "CP58335 (8x16)": 16, "CP58335 (8x14)": 14, "CP58335 (8x8)": 8, "CP58210 (8x16)": 16, "CP58210 (8x14)": 14, "CP58210 (8x8)": 8, "CP58152 (8x16)": 16, "CP58152 (8x14)": 14, "CP58152 (8x8)": 8, "CP30040 (8x16)": 16, "CP30040 (8x14)": 14, "CP30040 (8x8)": 8, "CP30039 (8x16)": 16, "CP30039 (8x14)": 14, "CP30039 (8x8)": 8, "CP30034 (8x16)": 16, "CP30034 (8x14)": 14, "CP30034 (8x8)": 8, "CP30033 (8x16)": 16, "CP30033 (8x14)": 14, "CP30033 (8x8)": 8, "CP30032 (8x16)": 16, "CP30032 (8x14)": 14, "CP30032 (8x8)": 8, "CP30031 (8x16)": 16, "CP30031 (8x14)": 14, "CP30031 (8x8)": 8, "CP30030 (8x16)": 16, "CP30030 (8x14)": 14, "CP30030 (8x8)": 8, "CP30029 (8x16)": 16, "CP30029 (8x14)": 14, "CP30029 (8x8)": 8, "CP30028 (8x16)": 16, "CP30028 (8x14)": 14, "CP30028 (8x8)": 8, "CP30027 (8x16)": 16, "CP30027 (8x14)": 14, "CP30027 (8x8)": 8, "CP30026 (8x16)": 16, "CP30026 (8x14)": 14, "CP30026 (8x8)": 8, "CP30025 (8x16)": 16, "CP30025 (8x14)": 14, "CP30025 (8x8)": 8, "CP30024 (8x16)": 16, "CP30024 (8x14)": 14, "CP30024 (8x8)": 8, "CP30023 (8x16)": 16, "CP30023 (8x14)": 14, "CP30023 (8x8)": 8, "CP30022 (8x16)": 16, "CP30022 (8x14)": 14, "CP30022 (8x8)": 8, "CP30021 (8x16)": 16, "CP30021 (8x14)": 14, "CP30021 (8x8)": 8, "CP30020 (8x16)": 16, "CP30020 (8x14)": 14, "CP30020 (8x8)": 8, "CP30019 (8x16)": 16, "CP30019 (8x14)": 14, "CP30019 (8x8)": 8, "CP30018 (8x16)": 16, "CP30018 (8x14)": 14, "CP30018 (8x8)": 8, "CP30017 (8x16)": 16, "CP30017 (8x14)": 14, "CP30017 (8x8)": 8, "CP30016 (8x16)": 16, "CP30016 (8x14)": 14, "CP30016 (8x8)": 8, "CP30015 (8x16)": 16, "CP30015 (8x14)": 14, "CP30015 (8x8)": 8, "CP30014 (8x16)": 16, "CP30014 (8x14)": 14, "CP30014 (8x8)": 8, "CP30013 (8x16)": 16, "CP30013 (8x14)": 14, "CP30013 (8x8)": 8, "CP30012 (8x16)": 16, "CP30012 (8x14)": 14, "CP30012 (8x8)": 8, "CP30011 (8x16)": 16, "CP30011 (8x14)": 14, "CP30011 (8x8)": 8, "CP30010 (8x16)": 16, "CP30010 (8x14)": 14, "CP30010 (8x8)": 8, "CP30009 (8x16)": 16, "CP30009 (8x14)": 14, "CP30009 (8x8)": 8, "CP30008 (8x16)": 16, "CP30008 (8x14)": 14, "CP30008 (8x8)": 8, "CP30007 (8x16)": 16, "CP30007 (8x14)": 14, "CP30007 (8x8)": 8, "CP30006 (8x16)": 16, "CP30006 (8x14)": 14, "CP30006 (8x8)": 8, "CP30005 (8x16)": 16, "CP30005 (8x14)": 14, "CP30005 (8x8)": 8, "CP30004 (8x16)": 16, "CP30004 (8x14)": 14, "CP30004 (8x8)": 8, "CP30003 (8x16)": 16, "CP30003 (8x14)": 14, "CP30003 (8x8)": 8, "CP30002 (8x16)": 16, "CP30002 (8x14)": 14, "CP30002 (8x8)": 8, "CP30001 (8x16)": 16, "CP30001 (8x14)": 14, "CP30001 (8x8)": 8, "CP30000 (8x16)": 16, "CP30000 (8x14)": 14, "CP30000 (8x8)": 8, "CP3848 (8x16)": 16, "CP3848 (8x14)": 14, "CP3848 (8x8)": 8, "CP3846 (8x16)": 16, "CP3846 (8x14)": 14, "CP3846 (8x8)": 8, "CP3845 (8x16)": 16, "CP3845 (8x14)": 14, "CP3845 (8x8)": 8, "CP3021 (8x16)": 16, "CP3021 (8x14)": 14, "CP3021 (8x8)": 8, "CP3012 (8x16)": 16, "CP3012 (8x14)": 14, "CP3012 (8x8)": 8, "CP1131 (8x16)": 16, "CP1131 (8x14)": 14, "CP1131 (8x8)": 8, "CP1125 (8x16)": 16, "CP1125 (8x14)": 14, "CP1125 (8x8)": 8, "CP1119 (8x16)": 16, "CP1119 (8x14)": 14, "CP1119 (8x8)": 8, "CP1118 (8x16)": 16, "CP1118 (8x14)": 14, "CP1118 (8x8)": 8, "CP1117 (8x16)": 16, "CP1117 (8x14)": 14, "CP1117 (8x8)": 8, "CP1116 (8x16)": 16, "CP1116 (8x14)": 14, "CP1116 (8x8)": 8, "CP991 (8x16)": 16, "CP991 (8x14)": 14, "CP991 (8x8)": 8, "CP899 (8x16)": 16, "CP899 (8x14)": 14, "CP899 (8x8)": 8, "CP895 (8x16)": 16, "CP895 (8x14)": 14, "CP895 (8x8)": 8, "CP872 (8x16)": 16, "CP872 (8x14)": 14, "CP872 (8x8)": 8, "CP869 (8x16)": 16, "CP869 (8x14)": 14, "CP869 (8x8)": 8, "CP867 (8x16)": 16, "CP867 (8x14)": 14, "CP867 (8x8)": 8, "CP866 (8x16)": 16, "CP866 (8x14)": 14, "CP866 (8x8)": 8, "CP865 (8x16)": 16, "CP865 (8x14)": 14, "CP865 (8x8)": 8, "CP864 (8x16)": 16, "CP864 (8x14)": 14, "CP864 (8x8)": 8, "CP863 (8x16)": 16, "CP863 (8x14)": 14, "CP863 (8x8)": 8, "CP862 (8x16)": 16, "CP862 (8x14)": 14, "CP862 (8x8)": 8, "CP861 (8x16)": 16, "CP861 (8x14)": 14, "CP861 (8x8)": 8, "CP860 (8x16)": 16, "CP860 (8x14)": 14, "CP860 (8x8)": 8, "CP859 (8x16)": 16, "CP859 (8x14)": 14, "CP859 (8x8)": 8, "CP858 (8x16)": 16, "CP858 (8x14)": 14, "CP858 (8x8)": 8, "CP857 (8x16)": 16, "CP857 (8x14)": 14, "CP857 (8x8)": 8, "CP856 (8x16)": 16, "CP856 (8x14)": 14, "CP856 (8x8)": 8, "CP855 (8x16)": 16, "CP855 (8x14)": 14, "CP855 (8x8)": 8, "CP853 (8x16)": 16, "CP853 (8x14)": 14, "CP853 (8x8)": 8, "CP852 (8x16)": 16, "CP852 (8x14)": 14, "CP852 (8x8)": 8, "CP851 (8x16)": 16, "CP851 (8x14)": 14, "CP851 (8x8)": 8, "CP850 (8x16)": 16, "CP850 (8x14)": 14, "CP850 (8x8)": 8, "CP849 (8x16)": 16, "CP849 (8x14)": 14, "CP849 (8x8)": 8, "CP848 (8x16)": 16, "CP848 (8x14)": 14, "CP848 (8x8)": 8, "CP808 (8x16)": 16, "CP808 (8x14)": 14, "CP808 (8x8)": 8, "CP790 (8x16)": 16, "CP790 (8x14)": 14, "CP790 (8x8)": 8, "CP778 (8x16)": 16, "CP778 (8x14)": 14, "CP778 (8x8)": 8, "CP777 (8x16)": 16, "CP777 (8x14)": 14, "CP777 (8x8)": 8, "CP775 (8x16)": 16, "CP775 (8x14)": 14, "CP775 (8x8)": 8, "CP774 (8x16)": 16, "CP774 (8x14)": 14, "CP774 (8x8)": 8, "CP773 (8x16)": 16, "CP773 (8x14)": 14, "CP773 (8x8)": 8, "CP772 (8x16)": 16, "CP772 (8x14)": 14, "CP772 (8x8)": 8, "CP771 (8x16)": 16, "CP771 (8x14)": 14, "CP771 (8x8)": 8, "CP770 (8x16)": 16, "CP770 (8x14)": 14, "CP770 (8x8)": 8, "CP737 (8x16)": 16, "CP737 (8x14)": 14, "CP737 (8x8)": 8, "CP668 (8x16)": 16, "CP668 (8x14)": 14, "CP668 (8x8)": 8, "CP667 (8x16)": 16, "CP667 (8x14)": 14, "CP667 (8x8)": 8, "CP437 (8x16)": 16, "CP437 (8x14)": 14, "CP437 (8x8)": 8, "CP113 (8x16)": 16, "CP113 (8x14)": 14, "CP113 (8x8)": 8 },
    "FREEBSD": { "SWISS (8x16)": 16, "SWISS (8x14)": 14, "SWISS (8x8)": 8, "SWIS1251 (8x16)": 16, "SWIS1131 (8x16)": 16, "KOI8-U (8x16)": 16, "KOI8-U (8x14)": 14, "KOI8-U (8x8)": 8, "KOI8-RC (8x16)": 16, "KOI8-RB (8x16)": 16, "KOI8-R (8x16)": 16, "KOI8-R (8x14)": 14, "KOI8-R (8x8)": 8, "ISO15 (8x16)": 16, "ISO15 (8x14)": 14, "ISO15 (8x8)": 8, "ISO15_T (8x16)": 16, "ISO09 (8x16)": 16, "ISO08 (8x16)": 16, "ISO08 (8x14)": 14, "ISO08 (8x8)": 8, "ISO07 (8x16)": 16, "ISO07 (8x14)": 14, "ISO07 (8x8)": 8, "ISO05 (8x16)": 16, "ISO05 (8x14)": 14, "ISO05 (8x8)": 8, "ISO04V9W (8x16)": 16, "ISO04V9 (8x16)": 16, "ISO04V9 (8x14)": 14, "ISO04V9 (8x8)": 8, "ISO04 (8x16)": 16, "ISO04 (8x14)": 14, "ISO04 (8x8)": 8, "ISO04_W (8x16)": 16, "ISO02 (8x16)": 16, "ISO02 (8x14)": 14, "ISO02 (8x8)": 8, "ISO01 (8x16)": 16, "ISO01 (8x14)": 14, "ISO01 (8x8)": 8, "ISO01_T (8x16)": 16, "HAIK8 (8x16)": 16, "HAIK8 (8x14)": 14, "HAIK8 (8x8)": 8, "CP1251 (8x16)": 16, "CP1251 (8x14)": 14, "CP1251 (8x8)": 8, "CP866U (8x16)": 16, "CP866U (8x14)": 14, "CP866U (8x8)": 8, "CP866C (8x16)": 16, "CP866B (8x16)": 16, "CP866 (8x16)": 16, "CP866 (8x14)": 14, "CP866 (8x8)": 8, "CP865 (8x16)": 16, "CP865 (8x14)": 14, "CP865 (8x8)": 8, "CP865_T (8x16)": 16, "CP865_T (8x8)": 8, "CP850 (8x16)": 16, "CP850 (8x14)": 14, "CP850 (8x8)": 8, "CP850_T (8x16)": 16, "CP850_T (8x8)": 8, "CP437 (8x16)": 16, "CP437 (8x14)": 14, "CP437 (8x8)": 8, "CP437_T (8x16)": 16, "CP437_T (8x8)": 8, "ARMSCII8 (8x16)": 16, "ARMSCII8 (8x14)": 14, "ARMSCII8 (8x8)": 8 },
    "DOSMIXED": { "CP885 (8x16)": 16, "CP885 (8x14)": 14, "CP885 (8x8)": 8, "CP884 (8x16)": 16, "CP884 (8x14)": 14, "CP884 (8x8)": 8, "CP883 (8x16)": 16, "CP883 (8x14)": 14, "CP883 (8x8)": 8, "CP882 (8x16)": 16, "CP882 (8x14)": 14, "CP882 (8x8)": 8, "CP881 (8x16)": 16, "CP881 (8x14)": 14, "CP881 (8x8)": 8, "CP880 (8x16)": 16, "CP880 (8x14)": 14, "CP880 (8x8)": 8, "CP865 (8x19)": 19, "CP865 (8x16)": 16, "CP865 (8x14)": 14, "CP865 (8x8)": 8, "CP864 (8x16)": 16, "CP864 (8x14)": 14, "CP864 (8x8)": 8, "CP863 (8x19)": 19, "CP863 (8x16)": 16, "CP863 (8x14)": 14, "CP863 (8x8)": 8, "CP862 (8x16)": 16, "CP862 (8x14)": 14, "CP862 (8x8)": 8, "CP861 (8x19)": 19, "CP861 (8x16)": 16, "CP861 (8x14)": 14, "CP861 (8x8)": 8, "CP860 (8x19)": 19, "CP860 (8x16)": 16, "CP860 (8x14)": 14, "CP860 (8x8)": 8, "CP853 (8x19)": 19, "CP853 (8x16)": 16, "CP853 (8x14)": 14, "CP853 (8x8)": 8, "CP852 (8x19)": 19, "CP852 (8x16)": 16, "CP852 (8x14)": 14, "CP852 (8x8)": 8, "CP851 (8x19)": 19, "CP851 (8x16)": 16, "CP851 (8x14)": 14, "CP851 (8x8)": 8, "CP850 (8x19)": 19, "CP850 (8x16)": 16, "CP850 (8x14)": 14, "CP850 (8x8)": 8, "CP437 (8x19)": 19, "CP437 (8x16)": 16, "CP437 (8x14)": 14, "CP437 (8x8)": 8, "CP113 (8x19)": 19, "CP113 (8x16)": 16, "CP113 (8x14)": 14, "CP113 (8x8)": 8, "CP112 (8x19)": 19, "CP112 (8x16)": 16, "CP112 (8x14)": 14, "CP112 (8x8)": 8, "CP111 (8x19)": 19, "CP111 (8x16)": 16, "CP111 (8x14)": 14, "CP111 (8x8)": 8 },
    "CMPQDOS6": { "TH-CP865 (8x16)": 16, "TH-CP865 (8x14)": 14, "TH-CP865 (8x8)": 8, "TH-CP863 (8x16)": 16, "TH-CP863 (8x14)": 14, "TH-CP863 (8x8)": 8, "TH-CP860 (8x16)": 16, "TH-CP860 (8x14)": 14, "TH-CP860 (8x8)": 8, "TH-CP852 (8x16)": 16, "TH-CP852 (8x14)": 14, "TH-CP852 (8x8)": 8, "TH-CP850 (8x16)": 16, "TH-CP850 (8x14)": 14, "TH-CP850 (8x8)": 8, "TH-CP437 (8x16)": 16, "TH-CP437 (8x14)": 14, "TH-CP437 (8x8)": 8, "GR-CP850 (8x16)": 16, "GR-CP850 (8x14)": 14, "GR-CP850 (8x8)": 8, "GR-CP437 (8x16)": 16, "GR-CP437 (8x14)": 14, "GR-CP437 (8x8)": 8 },
    "XGA_DRV": { "ALTCP865 (8x15)": 15, "ALTCP865 (8x14)": 14, "ALTCP863 (8x15)": 15, "ALTCP863 (8x14)": 14, "ALTCP860 (8x15)": 15, "ALTCP860 (8x14)": 14, "ALTCP850 (8x15)": 15, "ALTCP850 (8x14)": 14, "ALTCP437 (8x15)": 15, "ALTCP437 (8x14)": 14 },
    "VIET": { "SCRFONT3 (8x10)": 10, "SCRFONT2 (8x10)": 10, "SCRFONT1 (8x10)": 10, "SCRFONT (8x10)": 10 },
    "VGAGREEK": { "GREEK (8x8)": 8, "GREEK (8x7)": 7, "GREEK (8x6)": 6 },
    "ULTRAVIS": { "WINDOWS (8x19)": 19, "WINDOWS (8x14)": 14, "WINDOWS (8x9)": 9, "WINDOWS (8x8)": 8, "THIN (8x10)": 10, "SCRWL (8x16)~~~": 16, "SCRIPT2 (8x19)": 19, "SCRIPT2 (8x14)": 14, "SCRIPT2 (8x9)": 9, "SCRIPT2 (8x8)": 8, "SCRIPT1 (8x19)": 19, "SCRIPT1 (8x14)": 14, "SCRIPT1 (8x9)": 9, "SCRIPT1 (8x8)": 8, "SANS4 (8x19)": 19, "SANS4 (8x14)": 14, "SANS4-SC (8x19)": 19, "SANS4-SC (8x14)": 14, "SANS3 (8x19)": 19, "SANS3 (8x14)": 14, "SANS3-SC (8x19)": 19, "SANS3-SC (8x14)": 14, "SANS2 (8x19)": 19, "SANS2 (8x14)": 14, "SANS2 (8x9)": 9, "SANS2 (8x8)": 8, "SANS2-SC (8x19)": 19, "SANS2-SC (8x14)": 14, "SANS2-SC (8x9)": 9, "SANS2-SC (8x8)": 8, "SANS1 (8x19)": 19, "SANS1 (8x14)": 14, "SANS1 (8x9)": 9, "SANS1 (8x8)": 8, "SANS1-SC (8x19)": 19, "SANS1-SC (8x14)": 14, "SANS1-SC (8x9)": 9, "SANS1-SC (8x8)": 8, "RUNIC (8x16)": 16, "ROMAN2 (8x19)": 19, "ROMAN2 (8x14)": 14, "ROMAN2 (8x9)": 9, "ROMAN2 (8x8)": 8, "ROMAN1 (8x19)": 19, "ROMAN1 (8x14)": 14, "ROMAN1 (8x9)": 9, "ROMAN1 (8x8)": 8, "PC (8x19)": 19, "PC (8x14)": 14, "PC (8x9)": 9, "PC (8x8)": 8, "PC-SC (8x19)": 19, "PC-SC (8x14)": 14, "PC-SC (8x9)": 9, "PC-SC (8x8)": 8, "OLDENGL (8x19)": 19, "OLDENGL (8x14)": 14, "NEWFONT3 (8x19)": 19, "NEWFONT3 (8x14)": 14, "NEWFONT2 (8x19)": 19, "NEWFONT2 (8x14)": 14, "NEWFONT2 (8x9)": 9, "NEWFONT2 (8x8)": 8, "NEWFONT1 (8x19)": 19, "NEWFONT1 (8x14)": 14, "NEWFONT1 (8x9)": 9, "NEWFONT1 (8x8)": 8, "HEBCLRGF (8x16)": 16, "DATA (8x19)": 19, "DATA (8x14)": 14, "DATA (8x9)": 9, "DATA (8x8)": 8, "COURIER (8x19)": 19, "COURIER (8x9)": 9, "COURIER (8x8)": 8, "BROADWAY (8x19)": 19, "BROADWAY (8x9)": 9, "BROADWAY (8x8)": 8, "2_HEBREW (8x16)": 16 },
    "TSENGFED": { "8X14THIN (8x14)": 14, "8X14APL (8x14)": 14, "8X14 (8x14)": 14, "8X8THIN (8x8)": 8, "8X8 (8x8)": 8, "6X14 (8x14)": 14, "6X8 (8x8)": 8 },
    "SPEA_GDC": { "SYS8X20 (8x20)": 20, "SYS8X16 (8x16)": 16, "CONDBIT (8x16)": 16, "COND8X16 (8x16)": 16, "BIT8X20 (8x20)": 20, "BIT8X16 (8x16)": 16, "BIT8X15 (8x15)": 15, "BIT8X14 (8x14)": 14, "BIT8X8 (8x8)": 8 },
    "SEEMORE": { "CM-8X10 (8x10)": 10, "CM-7X13 (8x13)": 13, "CM-7X7 (8x7)": 7, "CM-6X10 (8x10)": 10, "CM-6X8 (8x8)": 8, "CM-6X6 (8x6)": 6, "CM-5X8 (8x8)": 8, "CM-5X6 (8x6)": 6, "CM-4X6 (8x6)": 6 },
    "RU_UTIL": { "Z_RUSS (8x16)": 16, "Z_RUSS (8x14)": 14, "Z_RUSS (8x8)": 8, "RUS_ARE (8x16)": 16, "RUS_ARE (8x14)": 14, "RUS_ARE (8x8)": 8, "RUS_AR6E (8x16)": 16, "RUS_AR6E (8x14)": 14, "RUS_AR6E (8x8)": 8, "RUS_AR6 (8x16)": 16, "RUS_AR6 (8x14)": 14, "RUS_AR6 (8x8)": 8, "RUS_AR1 (8x16)": 16, "RUS_AR1 (8x14)": 14, "RUS_AR1 (8x8)": 8, "RUS_AR (8x16)": 16, "RUS_AR (8x14)": 14, "RUS_AR (8x8)": 8 },
    "NANTOOLS": { "THIN_SS (8x16)": 16, "THIN_SS (8x14)": 14, "THIN_SS (8x8)": 8, "SIDE (8x10)": 10, "ROM8PIX (8x8)": 8, "POLISH (8x14)": 14, "PERSIAN (8x14)": 14, "PC (8x24)": 24, "PC_7 (8x14)": 14, "PC_6 (8x14)": 14, "OLDENG (8x14)": 14, "LBSCRIPT (8x14)": 14, "LBITALIC (8x16)": 16, "LBITALIC (8x14)": 14, "LBARABIC (8x14)": 14, "LB_OCR (8x16)": 16, "LB_OCR (8x14)": 14, "LB_MISC (8x14)": 14, "LB_LARGE (8x16)": 16, "GEORGIAN (8x14)": 14, "GAELIC (8x14)": 14, "FRACTUR (8x14)": 14, "CYRIL_B (8x8)": 8, "CP437BGR (8x8)": 8, "CP437ALT (8x8)": 8, "CNTDOWN (8x16)": 16, "BOXROUND (8x16)": 16, "BOXROUND (8x14)": 14, "APLS (8x8)": 8 },
    "INTEXT": { "YUGOSLA (8x14)": 14, "URDU (8x14)": 14, "TURKISH (8x14)": 14, "RUSSIAN (8x14)": 14, "POLISH (8x14)": 14, "HEBREW (8x14)": 14, "GREEK (8x14)": 14, "GAELIC (8x14)": 14, "FARSI (8x14)": 14, "EUROPE (8x14)": 14, "ARABIC (8x14)": 14 },
    "HERCPMOD": { "STANDARD (8x14)": 14, "SLANT (8x14)": 14, "SANSERIF (8x14)": 14, "MEDIEVAL (8x14)": 14, "LCD (8x14)": 14, "HRKGREEK (8x14)": 14, "HOLLOW (8x14)": 14, "HERCULES (8x14)": 14, "HERCULES (8x10)": 10, "HERCULES (8x8)": 8, "HERCITAL (8x8)": 8, "FUTURE (8x14)": 14, "COURIER (8x14)": 14, "COMPUTER (8x14)": 14, "BROADWAY (8x14)": 14, "BOLD (8x14)": 14, "BLOCK (8x14)": 14, "BLCKSNSF (8x10)": 10, "BIGSF (8x14)": 14, "BIGSERIF (8x16)": 16 },
    "HERCPLUS": { "THNSERIF (8x14)": 14, "THIN (8x14)": 14, "SUPER (8x14)": 14, "STRETCH (8x14)": 14, "STANDARD (8x14)": 14, "SMALL (8x10)": 10, "SLANT (8x14)": 14, "SCRIPT (8x14)": 14, "SANSERIF (8x14)": 14, "MEDIEVAL (8x14)": 14, "LCD (8x14)": 14, "HRKGREEK (8x14)": 14, "HOLLOW (8x14)": 14, "HERCULES (8x14)": 14, "HERCULES (8x10)": 10, "HERCULES (8x8)": 8, "HERCITAL (8x8)": 8, "FUTURE (8x14)": 14, "COURIER (8x14)": 14, "COMPUTER (8x14)": 14, "CHESSPT3 (8x16)": 16, "CHESSPT2 (8x16)": 16, "CHESSPT1 (8x16)": 16, "BROADWAY (8x14)": 14, "BOLD (8x14)": 14, "BLOCK (8x14)": 14, "BLCKSNSF (8x10)": 10, "BIGSF (8x14)": 14, "BIGSERIF (8x16)": 16 },
    "HEB_UTIL": { "VGAHEB92 (8x16)": 16, "LOADHEB (8x16)": 16, "IBMCGA83 (8x16)": 16, "IBMCGA83 (8x8)": 8, "HBRW1987 (8x16)": 16, "HBRW1987 (8x8)": 8, "FONTHE8 (8x8)": 8, "FONTHE (8x16)": 16 },
    "FONTMAN": { "SANSMALL (8x12)": 12, "SANSF1 (8x16)": 16, "SANSERIF (8x16)": 16, "ORATOR (8x16)": 16, "MINI (8x8)": 8, "FLORI (8x16)": 16, "DONNA (8x16)": 16 },
    "FE2": { "YIDDISH (8x16)": 16, "WACKY (8x16)": 16, "TINYTYPE (8x8)": 8, "THNSERIF (8x16)": 16, "THIN8X8 (8x8)": 8, "THIN (8x16)": 16, "THAI (8x16)": 16, "TENGWAR (8x16)": 16, "STRETCH (8x16)": 16, "SMVGA88 (8x8)": 8, "SMVGA (8x16)": 16, "SMOOTH (8x16)": 16, "SMEGA88 (8x8)": 8, "SMEGA (8x14)": 14, "SMALL (8x10)": 10, "SIMPLE (8x16)": 16, "SIMPAGAR (8x16)": 16, "SERIFBIG (8x16)": 16, "SCRIPT4 (8x16)": 16, "SCRIPT3 (8x16)": 16, "SCRIPT2 (8x16)": 16, "SCRIPT (8x16)": 16, "SCRAWL (8x16)": 16, "RUNES (8x16)": 16, "ROMANY (8x16)": 16, "PERCY (8x16)": 16, "PEKIGORD (8x16)": 16, "PARKAVE (8x16)": 16, "OUTLINE (8x11)": 11, "NUTSO (8x16)": 16, "MORSE (8x16)": 16, "MERP3 (8x16)": 16, "MERP2 (8x16)": 16, "MERP (8x16)": 16, "LEGEND (8x16)": 16, "LCD (8x16)": 16, "KOOL (8x16)": 16, "JULIE2 (8x16)": 16, "JULIE (8x16)": 16, "JAP (8x14)": 14, "IVAN (8x14)": 14, "ITALIC3 (8x16)": 16, "ITALIC2 (8x16)": 16, "HIGHSEAS (8x14)": 14, "HEBREW (8x16)": 16, "GOTHIC2 (8x16)": 16, "GOTHIC (8x16)": 16, "GOTH_NEW (8x16)": 16, "GAELIC (8x16)": 16, "FUTURA (8x16)": 16, "FRESNO (8x16)": 16, "FRESNO (8x14)": 14, "FE_8X16 (8x16)": 16, "FE_8X14 (8x14)": 14, "FE_8X8 (8x8)": 8, "FANTASY (8x8)": 8, "F0 (8x14)": 14, "ELERGON (8x16)": 16, "ELEGITAL (8x16)": 16, "ELEGANTE (8x16)": 16, "ELEGANT2 (8x16)": 16, "DEF_8X16 (8x16)": 16, "DEF_8X14 (8x14)": 14, "DEF_8X8 (8x8)": 8, "CYRILLIC (8x16)": 16, "CYRILLI3 (8x16)": 16, "CYRILLI2 (8x16)": 16, "COURIER1 (8x16)": 16, "COURIER (8x16)": 16, "COMPUTR3 (8x16)": 16, "COMPUTR3 (8x8)": 8, "COMPUTR2 (8x16)": 16, "COMPUTER (8x16)": 16, "CIRCLE (8x16)": 16, "CALCULAT (8x16)": 16, "BRUSH (8x16)": 16, "BROADWY3 (8x16)": 16, "BROADWY2 (8x16)": 16, "BROADWY1 (8x16)": 16, "BROADWAY (8x16)": 16, "BRAILLE (8x16)": 16, "BOLD5 (8x16)": 16, "BOLD4 (8x16)": 16, "BOLD3 (8x16)": 16, "BOLD2 (8x16)": 16, "BOLD1 (8x16)": 16, "BOLD0 (8x16)": 16, "BODONI (8x16)": 16, "BLOODY (8x16)": 16, "BINARY (8x16)": 16, "BAUHAUS (8x16)": 16, "BACKSLNT (8x16)": 16, "ASCII_HX (8x16)": 16, "APLS11 (8x11)": 11, "APLS10 (8x10)": 10, "APLS (8x16)": 16, "ANTIQUE (8x16)": 16, "AMBASSAD (8x16)": 16, "3270 (8x14)": 14, "32 (8x32)": 32, "9X16SNSF (8x16)": 16, "8X14 (8x16)": 16, "8X11SNSF (8x11)": 11, "8X10 (8x10)": 10, "8X8ITAL (8x8)": 8, "8X6 (8x6)": 6 },
    "DFE": { "THINDEMO (8x14)": 14, "RMRKBOLD (8x14)": 14, "RIMROCK (8x10)": 10, "ITALICS (8x14)": 14, "INVERTED (8x14)": 14, "ICONS (8x14)": 14, "CP866 (8x16)": 16, "CP866 (8x14)": 14, "CP866 (8x8)": 8, "BACKWARD (8x14)": 14 },
    "CHET": { "THINSCRP (8x14)": 14, "THINCAPS (8x14)": 14, "SMALCAPS (8x14)": 14, "BHEXLO (8x14)": 14, "BHEXHI (8x14)": 14, "BHEXBOX (8x14)": 14, "BHEXALL (8x14)": 14, "BDECLO (8x14)": 14, "B (8x14)": 14 },
    "CAFE": { "PP_SSER (8x16)": 16, "PP_ROMAN (8x16)": 16, "POLICE (8x16)": 16, "CAFE (8x12)": 12, "CAFE (8x10)": 10 },
    "PC-OTHER": { "WVGA9 (8x16)": 16, "WVGA9 (8x14)": 14, "WVGA8 (8x16)": 16, "WVGA8 (8x14)": 14, "WVGA8 (8x8)": 8, "WVGA8_D (8x16)": 16, "VTECH (8x8)": 8, "VTECH_D (8x16)": 16, "VERITE (8x16)": 16, "VERITE (8x14)": 14, "VERITE (8x8)": 8, "VERITE_D (8x16)": 16, "TRIVGA9 (8x16)": 16, "TRIVGA9 (8x14)": 14, "TRIVGA8 (8x16)": 16, "TRIVGA8 (8x14)": 14, "TRIVGA8 (8x8)": 8, "TRI89B (8x11)": 11, "TRI88CSO (8x11)": 11, "TRI88CS9 (8x16)": 16, "TRI88CS9 (8x14)": 14, "TRI88CS8 (8x16)": 16, "TRI88CS8 (8x14)": 14, "TRI88CS8 (8x11)": 11, "TRI88CS8 (8x8)": 8, "TOSH-SAT (8x16)": 16, "TOSH-SAT (8x14)": 14, "TOSH-SAT (8x8)": 8, "TELEPC (8x9)": 9, "TELEPC_D (8x18)": 18, "TANDY2M9 (8x14)": 14, "TANDY2 (8x9)": 9, "TANDY2 (8x8)": 8, "TANDY2_D (8x18)": 18, "TANDY2_D (8x16)": 16, "TANDY1 (8x9)": 9, "TANDY1 (8x8)": 8, "TANDY1_D (8x18)": 18, "TANDY1_D (8x16)": 16, "T3100-B4 (8x16)": 16, "T3100-B4 (8x8)": 8, "T3100-B3 (8x16)": 16, "T3100-B3 (8x8)": 8, "T3100-B2 (8x16)": 16, "T3100-B2 (8x8)": 8, "T3100-B1 (8x16)": 16, "T3100-B1 (8x8)": 8, "T3100-A4 (8x16)": 16, "T3100-A4 (8x8)": 8, "T3100-A3 (8x16)": 16, "T3100-A3 (8x8)": 8, "T3100-A2 (8x16)": 16, "T3100-A2 (8x8)": 8, "T3100-A1 (8x16)": 16, "T3100-A1 (8x8)": 8, "STB-EGA9 (8x14)": 14, "STB-EGA8 (8x14)": 14, "SPERRYHI (8x16)": 16, "SPERRY (8x8)": 8, "SPERRY_D (8x16)": 16, "SM910 (8x16)": 16, "SM910 (8x14)": 14, "SM910 (8x8)": 8, "SM910_D (8x8)": 8, "SIGRM9 (8x16)": 16, "SIGRM9 (8x14)": 14, "SIGRM8 (8x16)": 16, "SIGRM8 (8x14)": 14, "SIGRM8 (8x8)": 8, "SHARP3K2 (8x8)": 8, "SHARP3K1 (8x8)": 8, "SEEQUA (8x8)": 8, "SEEQUA_D (8x16)": 16, "RUMONOX9 (8x14)": 14, "RUMG2M9 (8x14)": 14, "RUMG2C (8x8)": 8, "RUMG2C_D (8x16)": 16, "RUMG1M9 (8x14)": 14, "RUMG1C (8x8)": 8, "RUMG1C_D (8x16)": 16, "RUHGC2-9 (8x14)": 14, "RUHGC1-9 (8x14)": 14, "RUGENM9 (8x14)": 14, "RUGENC2D (8x16)": 16, "RUGENC2 (8x8)": 8, "RUGENC1D (8x16)": 16, "RUGENC1 (8x8)": 8, "PVGAP132 (8x16)": 16, "PVGAP132 (8x9)": 9, "PVBGC3 (8x8)": 8, "PVBGC3_D (8x16)": 16, "PVBGC2 (8x8)": 8, "PVBGC2_D (8x16)": 16, "PVBGC1 (8x8)": 8, "PVBGC1_D (8x16)": 16, "PPC4 (8x8)": 8, "PPC4_D (8x16)": 16, "PPC3 (8x8)": 8, "PPC3_D (8x16)": 16, "PPC2 (8x8)": 8, "PPC2_D (8x16)": 16, "PPC1 (8x8)": 8, "PPC1_D (8x16)": 16, "PPC-M4 (8x14)": 14, "PPC-M3 (8x14)": 14, "PPC-M2 (8x14)": 14, "PPC-M1 (8x14)": 14, "PHXVGA8 (8x16)": 16, "PHXVGA8 (8x14)": 14, "PHXVGA8 (8x8)": 8, "PHXEGA9 (8x14)": 14, "PHXEGA8D (8x16)": 16, "PHXEGA8 (8x16)": 16, "PHXEGA8 (8x14)": 14, "PHXEGA8 (8x8)": 8, "PHXBIOSD (8x16)": 16, "PHXBIOS (8x8)": 8, "PC6300 (8x16)": 16, "PC1640DD (8x16)": 16, "PC1640D (8x8)": 8, "PC1640CD (8x16)": 16, "PC1640C (8x8)": 8, "PC1640BD (8x16)": 16, "PC1640B (8x8)": 8, "PC1640AD (8x16)": 16, "PC1640A (8x8)": 8, "OLIVM15D (8x16)": 16, "OLIVM15 (8x8)": 8, "OLIVGR (8x16)": 16, "OLIVGR (8x8)": 8, "OLIVGR_D (8x16)": 16, "OLIPC1TT (8x16)": 16, "OLIPC1TT (8x8)": 8, "OLIPC1HE (8x16)": 16, "OLIPC1HE (8x8)": 8, "OLIPC1GR (8x16)": 16, "OLIPC1GR (8x8)": 8, "OLIPC1EU (8x16)": 16, "OLIPC1EU (8x8)": 8, "NIX-M35D (8x16)": 16, "NIX-M35 (8x8)": 8, "NIX-M16 (8x16)": 16, "NIX-M15B (8x16)": 16, "NIX-M15A (8x16)": 16, "NEC-MS2B (8x16)": 16, "NEC-MS2B (8x8)": 8, "NEC-MS2A (8x16)": 16, "NEC-MS2A (8x8)": 8, "NEC-MS1B (8x16)": 16, "NEC-MS1B (8x8)": 8, "NEC-MS1A (8x16)": 16, "NEC-MS1A (8x8)": 8, "MTGRC9 (8x8)": 8, "MTGRC9_D (8x16)": 16, "MTGRC8 (8x8)": 8, "MTGRC8_D (8x16)": 16, "MTGRC7 (8x8)": 8, "MTGRC7_D (8x16)": 16, "MTGRC6 (8x8)": 8, "MTGRC6_D (8x16)": 16, "MTGRC5 (8x8)": 8, "MTGRC5_D (8x16)": 16, "MTGRC4 (8x8)": 8, "MTGRC4_D (8x16)": 16, "MTGRC3 (8x8)": 8, "MTGRC3_D (8x16)": 16, "MTGRC2 (8x8)": 8, "MTGRC2_D (8x16)": 16, "MTGRC1 (8x8)": 8, "MTGRC1_D (8x16)": 16, "MPACT (8x16)": 16, "MPACT (8x14)": 14, "MPACT (8x8)": 8, "MPACT_D (8x16)": 16, "MBPC230M (8x14)": 14, "MBPC230D (8x16)": 16, "MBPC230 (8x16)": 16, "MBPC230 (8x14)": 14, "MBPC230 (8x8)": 8, "MBC775 (8x8)": 8, "MBC775_D (8x16)": 16, "MBC55X (8x8)": 8, "MBC55X_D (8x16)": 16, "MBC16B (8x8)": 8, "MBC16B_D (8x16)": 16, "LE-D9 (8x14)": 14, "LE-D (8x8)": 8, "LE-D_D (8x16)": 16, "LBPC (8x8)": 8, "LBPC_D (8x16)": 16, "KPRO2K (8x8)": 8, "KPRO2K_D (8x16)": 16, "JAT-RMM9 (8x14)": 14, "JAT-RMCD (8x16)": 16, "JAT-RMC (8x8)": 8, "JAT-MM9 (8x14)": 14, "JAT-MC (8x8)": 8, "JAT-MC_D (8x16)": 16, "ITTXNW (8x8)": 8, "ITTXNW_D (8x16)": 16, "ITTX (8x8)": 8, "ITTX_D (8x16)": 16, "INTELV9 (8x16)": 16, "INTELV8 (8x16)": 16, "INTELV8 (8x8)": 8, "IGSVGA9 (8x16)": 16, "IGSVGA8 (8x16)": 16, "HYUNMGR9 (8x14)": 14, "HP-LX8PT (8x8)": 8, "HP-LX8NO (8x8)": 8, "HP-LX8L2 (8x8)": 8, "HP-LX8L1 (8x8)": 8, "HP-LX8CF (8x8)": 8, "HP-LX8 (8x8)": 8, "HP-LX6PT (8x8)": 8, "HP-LX6NO (8x8)": 8, "HP-LX6L2 (8x8)": 8, "HP-LX6L1 (8x8)": 8, "HP-LX6CF (8x8)": 8, "HP-LX6 (8x8)": 8, "GRMONOX9 (8x14)": 14, "GNEGA132 (8x12)": 12, "GNEGA132 (8x11)": 11, "EVXMEEGA (8x16)": 16, "EVXME132 (8x8)": 8, "EVXME94 (8x8)": 8, "EUROPC9 (8x14)": 14, "EUROPC (8x8)": 8, "EUROPC_D (8x16)": 16, "ET2K-132 (8x14)": 14, "ET2K-132 (8x8)": 8, "EPSONQM9 (8x14)": 14, "EPSONQ2D (8x16)": 16, "EPSONQ2 (8x8)": 8, "EPSONQ1D (8x16)": 16, "EPSONQ1 (8x8)": 8, "EAGLE3 (8x8)": 8, "EAGLE3_D (8x16)": 16, "EAGLE2 (8x8)": 8, "EAGLE2_D (8x16)": 16, "EAGLE1 (8x8)": 8, "EAGLE1_D (8x16)": 16, "DTK8X8 (8x8)": 8, "DTK8X8_D (8x16)": 16, "DG1ALT (8x8)": 8, "DG1ALT_D (8x16)": 16, "DG1 (8x8)": 8, "DG1_D (8x16)": 16, "COPAMX (8x8)": 8, "COPAMX_D (8x16)": 16, "COMPAQTH (8x16)": 16, "COMPAQTH (8x14)": 14, "COMPAQTH (8x8)": 8, "COMPAQP3 (8x16)": 16, "CLPORT9 (8x16)": 16, "CLPORT8B (8x19)": 19, "CLPORT8B (8x16)": 16, "CLPORT8 (8x19)": 19, "CLPORT8 (8x16)": 16, "CL5320-9 (8x16)": 16, "CL5320-8 (8x16)": 16, "C&T-HIQV (8x16)": 16, "C&T-HIQV (8x14)": 14, "C&T-HIQV (8x8)": 8, "ATISWGRD (8x16)": 16, "ATISWGR9 (8x14)": 14, "ATISWGR (8x8)": 8, "ATISMLW6 (8x8)": 8, "ATIKRVGA (8x16)": 16, "ATI9X16 (8x16)": 16, "ATI9X14 (8x14)": 14, "ATI8X16 (8x16)": 16, "ATI8X14 (8x14)": 14, "ATI8X8 (8x8)": 8, "ATI8X8_D (8x16)": 16, "AST-EXEC (8x19)": 19, "AMIEGA9 (8x14)": 14, "AMIEGA8D (8x16)": 16, "AMIEGA8 (8x14)": 14, "AMIEGA8 (8x8)": 8, "ACERV9 (8x16)": 16, "ACERV9 (8x14)": 14, "ACERV8 (8x16)": 16, "ACERV8 (8x14)": 14, "ACERV8 (8x8)": 8, "ACERV8_D (8x16)": 16, "ACERGRM9 (8x14)": 14, "ACERGRCD (8x16)": 16, "ACERGRC (8x8)": 8, "ACER710M (8x14)": 14, "ACER710D (8x16)": 16, "ACER710 (8x8)": 8, "3DL-B (8x16)": 16, "3DL-B (8x14)": 14, "3DL-B (8x8)": 8, "3DL-A9 (8x16)": 16, "3DL-A9 (8x14)": 14, "3DL-A8 (8x16)": 16, "3DL-A8 (8x14)": 14, "3DL-A8 (8x8)": 8 },
    "PC-IBM": { "VGA9 (8x16)": 16, "VGA8 (8x16)": 16, "PS2THIN4 (8x16)": 16, "PS2THIN3 (8x16)": 16, "PS2THIN2 (8x16)": 16, "PS2THIN1 (8x16)": 16, "PS2OLD9 (8x16)": 16, "PS2OLD8 (8x16)": 16, "PGC (8x16)": 16, "PCCONV (8x8)": 8, "PCCONV_D (8x16)": 16, "MDA9 (8x14)": 14, "ISO (8x16)": 16, "EUMDA9 (8x14)": 14, "EUCGAT (8x8)": 8, "EUCGAT_D (8x16)": 16, "EUCGA (8x8)": 8, "EUCGA_D (8x16)": 16, "EGA9 (8x14)": 14, "EGA8 (8x14)": 14, "CGA (8x8)": 8, "CGA-TH (8x8)": 8, "CGA-TH_D (8x16)": 16, "CGA_D (8x16)": 16, "BIOS (8x8)": 8, "BIOS_D (8x16)": 16, "3270PC9 (8x14)": 14 },
    "NON-PC": { "Z100-B (8x9)": 9, "Z100-B_D (8x18)": 18, "Z100-A (8x9)": 9, "Z100-A_D (8x18)": 18, "YES-T (8x10)": 10, "YES-T_D (8x20)": 20, "YES-GR (8x10)": 10, "YES-GR_D (8x20)": 20, "WANGPCMD (8x24)": 24, "WANGPCM (8x12)": 12, "WANGPCLD (8x18)": 18, "WANGPCL (8x9)": 9, "WANG437M (8x24)": 24, "WANG437M (8x12)": 12, "WANG437D (8x18)": 18, "WANG437 (8x9)": 9, "VT220ROM (8x20)": 20, "VT220ROM (8x10)": 10, "VT220CRT (8x20)": 20, "VT220CRT (8x10)": 10, "TOSHT300 (8x16)": 16, "TOSHT300 (8x8)": 8, "TI-PC-9 (8x12)": 12, "TANDY2K2 (8x16)": 16, "TANDY2K2 (8x8)": 8, "TANDY2K1 (8x16)": 16, "SIEMPCD (8x14)": 14, "RB100ROM (8x20)": 20, "RB100ROM (8x10)": 10, "RB100CRT (8x20)": 20, "RB100CRT (8x10)": 10, "OTRONA-A (8x20)": 20, "OTRONA-A (8x10)": 10, "NIMBUS2D (8x20)": 20, "NIMBUS2 (8x10)": 10, "NIMBUS1D (8x20)": 20, "NIMBUS1 (8x10)": 10, "MINDSETD (8x16)": 16, "MINDSET (8x8)": 8, "KAYPROII (8x20)": 20, "KAYPROII (8x10)": 10, "KAYPRO10 (8x16)": 16, "FM-TOWNS (8x16)": 16, "FM-TOWNS (8x8)": 8, "COMPIS (8x16)": 16, "BBC512BX (8x20)": 20, "BBC512BD (8x16)": 16, "BBC512B (8x8)": 8, "BBC512 (8x8)": 8, "BBC512_X (8x20)": 20, "BBC512_D (8x16)": 16, "ATARIPOF (8x8)": 8, "AS-100 (8x16)": 16, "APRIXENC (8x14)": 14, "APRIPORT (8x8)": 8, "APRI256D (8x20)": 20, "APRI256 (8x10)": 10, "APRI200D (8x16)": 16, "APRI200 (8x8)": 8, "APRI-M (8x16)": 16, "APC-III (8x16)": 16, "APC-III (8x8)": 8, "A7100RU2 (8x16)": 16, "A7100RU1 (8x16)": 16, "A7100-US (8x16)": 16 },
    "BIGPILE": { "WIGGLY (8x16)": 16, "WACKY2 (8x16)": 16, "VOYNICH (8x16)": 16, "VGA-ROM (8x16)": 16, "VGA-ROM (8x14)": 14, "VGA-ROM (8x8)": 8, "THINASCI (8x7)": 7, "THAI (8x14)": 14, "TEX-MATH (8x16)": 16, "TEX-MATH (8x14)": 14, "SWISSBX2 (8x16)": 16, "SWISSBOX (8x16)": 16, "SWISSAV2 (8x16)": 16, "SWISS (8x16)": 16, "SWISS-AV (8x16)": 16, "SUPER (8x16)": 16, "SUBSUP (8x16)": 16, "STRETCH (8x14)": 14, "STANDARD (8x16)": 16, "SQUARE (8x12)": 12, "SPRANTO2 (8x16)": 16, "SPRANTO1 (8x16)": 16, "SPRANTO (8x14)": 14, "SMCAPSSQ (8x13)": 13, "SMCAPNUM (8x14)": 14, "SLANT2 (8x14)": 14, "SECURITY (8x14)": 14, "SCRWL (8x16)---": 16, "SCRAWL2 (8x16)": 16, "SANSERIX (8x16)": 16, "SANSERIF (8x16)": 16, "RUSSIAN (8x16)": 16, "RUSSIAN (8x14)": 14, "RUSSIAN (8x8)": 8, "RUNIC (8x14)": 14, "ROTUND (8x16)": 16, "ROMAN3 (8x16)": 16, "ROMAN (8x16)": 16, "ROMAN (8x14)": 14, "REZPOUET (8x8)": 8, "REVERSE (8x14)": 14, "READABLE (8x10)": 10, "READABLE (8x8)": 8, "READABL8 (8x16)": 16, "READABL7 (8x16)": 16, "PERSIAN (8x16)": 16, "OLDENG-F (8x16)": 16, "OLD-ENGL (8x16)": 16, "OLD-ENGL (8x14)": 14, "NORWAY2 (8x14)": 14, "NORWAY (8x14)": 14, "NORTON1 (8x16)": 16, "NORTON0 (8x16)": 16, "MODERN (8x16)": 16, "MEDIEVAL (8x16)": 16, "MADRID (8x10)": 10, "MACNTOSH (8x16)": 16, "MACNTOSH (8x14)": 14, "MAC (8x8)": 8, "KEWL (8x16)": 16, "KANA (8x16)": 16, "KANA (8x14)": 14, "ISO4 (8x14)": 14, "ISO3 (8x14)": 14, "ISO2 (8x14)": 14, "ISO (8x14)": 14, "HYLAS (8x14)": 14, "HUGE (8x16)": 16, "HOLLOW (8x16)": 16, "HEBYOGI (8x16)": 16, "HEBUGLY (8x16)": 16, "HEBLARGE (8x16)": 16, "HEBLARGE (8x14)": 14, "HEBKTAV2 (8x16)": 16, "HEBKTAV1 (8x16)": 16, "HEBIBM83 (8x16)": 16, "HEBIBM83 (8x8)": 8, "HEBCLRGF (8x14)": 14, "HEBBOLDK (8x16)": 16, "HEB-SNSF (8x14)": 14, "HEB-MED (8x14)": 14, "HEB-KTAB (8x14)": 14, "HEB-BOLD (8x16)": 16, "HEB-BIG (8x14)": 14, "HEB-7BIT (8x16)": 16, "HANDWRIT (8x16)": 16, "HANDWRIT (8x14)": 14, "HANDUGLY (8x16)": 16, "HACK4TH (8x16)": 16, "GREEKALT (8x16)": 16, "GREEK2 (8x14)": 14, "GREEK (8x16)": 16, "GREEK (8x14)": 14, "GRCKSSRF (8x16)": 16, "GRCKSSRF (8x14)": 14, "GRCKSSRF (8x8)": 8, "FWORKS (8x13)": 13, "FWORKS (8x12)": 12, "FINNISH (8x14)": 14, "F0ALT (8x14)": 14, "EVGA-ALT (8x13)": 13, "EVGA-ALT (8x12)": 12, "EVGA-ALT (8x11)": 11, "EVGA-ALT (8x10)": 10, "EVGA-ALT (8x9)": 9, "EVGA-ALT (8x8)": 8, "DRAWHI (8x14)": 14, "DRAW (8x14)": 14, "DKY#001 (8x16)": 16, "DECORATE (8x16)": 16, "CYRILLIC (8x14)": 14, "CYRILL3 (8x16)": 16, "CYRILL3 (8x14)": 14, "CYRILL3 (8x8)": 8, "CYRILL2 (8x16)": 16, "CYRILL2 (8x14)": 14, "CYRILL2 (8x8)": 8, "CYRILL1 (8x16)": 16, "CYRILL1 (8x14)": 14, "CYRILL1 (8x8)": 8, "CYRIL2 (8x14)": 14, "CORRODED (8x16)": 16, "CNTDOWN (8x14)": 14, "BWAY2 (8x14)": 14, "BULKY (8x16)": 16, "BTHIN (8x14)": 14, "BLKBOARD (8x16)": 16, "BINARYED (8x14)": 14, "BIGSERIF (8x14)": 14, "BIGGER (8x16)": 16, "ASCII (8x14)": 14, "ARTX (8x16)": 16, "ART (8x16)": 16, "ARMENIAN (8x16)": 16, "ARMENIAN (8x8)": 8, "ARBNASKH (8x14)": 14, "ARABNAF (8x14)": 14, "ARABKUFI (8x14)": 14, "ARABDRFT (8x14)": 14, "APEAUS (8x16)": 16, "APEAUS (8x14)": 14, "APEAUS (8x8)": 8, "ANTIQUE (8x14)": 14, "ANSIBLE (8x16)": 16, "ANSIBLE (8x14)": 14, "2_HEBREW (8x14)": 14 },
    "MISC": { "NICER40C (8x16)": 16, "INVASION (8x8)": 8, "HUGE-VGA (8x32)": 32, "FM-T-437 (8x16)": 16, "FM-T-437 (8x8)": 8, "FATSCII (8x16)": 16, "ESCHATON (8x8)": 8, "EDDA9 (8x14)": 14, "DOSV-437 (8x16)": 16, "DOSJ-437 (8x19)": 19, "DOSJ-437 (8x16)": 16, "BLUETERM (8x12)": 12, "AIXOID9 (8x20)": 20, "AIXOID9 (8x16)": 16, "AIXOID8 (8x14)": 14, "AIXOID8 (8x12)": 12, "40C-TYPE (8x24)": 24, "9THWAVE (8x14)": 14 },
}
const lospec_palette_names = [];
const lospec_palette_list = {
    "Isolated16": "Isolated16",
    "AJMSX": "AJMSX",
    "link awakening : links colour": "link awakening : links colour",
    "MICROSOFT VGA": "MICROSOFT VGA",
    "Corruption-16": "Corruption-16",
    "Sweetie 16": "Sweetie 16",
    "Steam Lords": "Steam Lords",
    "NA16": "NA16",
    "Island Joy 16": "Island Joy 16",
    "PICO-8": "PICO-8",
    "Bubblegum 16": "Bubblegum 16",
    "Lost Century": "Lost Century",
    "Endesga 16": "Endesga 16",
    "vanilla milkshake": "vanilla milkshake",
    "Galaxy Flame": "Galaxy Flame",
    "DawnBringer 16": "DawnBringer 16",
    "Microsoft Windows": "Microsoft Windows",
    "Taffy 16": "Taffy 16",
    "Commodore 64": "Commodore 64",
    "antiquity16": "antiquity16",
    "Go-line": "Go-line",
    "Color Graphics Adapter": "Color Graphics Adapter",
    "16 Bital": "16 Bital",
    "ARQ16": "ARQ16",
    "Punolite": "Punolite",
    "Nanner 16": "Nanner 16",
    "colorquest-16": "colorquest-16",
    "Cretaceous-16": "Cretaceous-16",
    "Cthulhu 16": "Cthulhu 16",
    "Summers Past-16": "Summers Past-16",
    "Nanner Jam": "Nanner Jam",
    "Flowers": "Flowers",
    "SHIDO CYBERNEON": "SHIDO CYBERNEON",
    "Forest-16": "Forest-16",
    "Peachy Pop 16": "Peachy Pop 16",
    "retrobubble.": "retrobubble.",
    "Fading 16": "Fading 16",
    "AAP-16": "AAP-16",
    "Triton 16": "Triton 16",
    "URBEX 16": "URBEX 16",
    "Oxygen 16": "Oxygen 16",
    "Soldier 16": "Soldier 16",
    "Colodore": "Colodore",
    "Versitle 16": "Versitle 16",
    "Endesga Soft 16": "Endesga Soft 16",
    "retro_cal": "retro_cal",
    "Skedd16": "Skedd16",
    "Europa 16": "Europa 16",
    "prospec_cal": "prospec_cal",
    "Cookiebox-16": "Cookiebox-16",
    "colorquest (retro recolor)": "colorquest (retro recolor)",
    "PP-16": "PP-16",
    "Darkseed 16": "Darkseed 16",
    "mystic-16": "mystic-16",
    "PICO-DB": "PICO-DB",
    "Tauriel-16": "Tauriel-16",
    "FZT Ethereal 16": "FZT Ethereal 16",
    "Bloom 16": "Bloom 16",
    "Commodore VIC-20": "Commodore VIC-20",
    "JONK 16": "JONK 16",
    "Macintosh II": "Macintosh II",
    "eteRN16": "eteRN16",
    "Explorers16": "Explorers16",
    "Smooth 16": "Smooth 16",
    "System Mini 16": "System Mini 16",
    "Shine 16": "Shine 16",
    "WinterFes 16": "WinterFes 16",
    "Sk 16": "Sk 16",
    "Melody 16": "Melody 16",
    "Lump 16": "Lump 16",
    "Harpy 16": "Harpy 16",
    "Combi 16": "Combi 16",
    "Doomed": "Doomed",
    "Magik16": "Magik16",
    "PYXEL": "PYXEL",
    "Colorblind 16": "Colorblind 16",
    "Autumn": "Autumn",
    "Lemon 16": "Lemon 16",
    "SimpleJPC-16": "SimpleJPC-16",
    "Nord theme": "Nord theme",
    "Colodore VIC-64": "Colodore VIC-64",
    "Griefwards and through": "Griefwards and through",
    "ENOS16": "ENOS16",
    "Ultima VI Atari ST": "Ultima VI Atari ST",
    "psyche16": "psyche16",
    "ADB hybrid 16": "ADB hybrid 16",
    "Mappletosh 16": "Mappletosh 16",
    "Just add water": "Just add water",
    "Damage Dice 10 & 6": "Damage Dice 10 & 6",
    "Hasty Rainbow 4bit": "Hasty Rainbow 4bit",
    "vampire-16": "vampire-16",
    "Loop Hero": "Loop Hero",
    "Astron ST16": "Astron ST16",
    "Lovey-Dovey 16": "Lovey-Dovey 16",
    "Jr-Comp": "Jr-Comp",
    "Ye Olde Pirate Modde": "Ye Olde Pirate Modde",
    "trk-losat-16": "trk-losat-16",
    "The Perfect Palette pocket": "The Perfect Palette pocket",
    "WILSON16": "WILSON16",
    "Zeitgeist16": "Zeitgeist16",
    "AGC16": "AGC16",
    "Natural Colour System 16": "Natural Colour System 16",
    "drowsy 16": "drowsy 16",
    "Minecraft Wool": "Minecraft Wool",
    "Deep 16": "Deep 16",
    "Deep Forest 16": "Deep Forest 16",
    "Huc 16": "Huc 16",
    "Thanksmas 16": "Thanksmas 16",
    "king-16": "king-16",
    "Pastel Love": "Pastel Love",
    "BPRD-16": "BPRD-16",
    "V.O.S.P ": "V.O.S.P ",
    "Rayleigh": "Rayleigh",
    "Old Christmas": "Old Christmas",
    "Jr-16": "Jr-16",
    "Tropical Chancer": "Tropical Chancer",
    "GRAYSCALE 16": "GRAYSCALE 16",
    "Ladder 5": "Ladder 5",
    "Shifty16": "Shifty16",
    "super pocket boy": "super pocket boy",
    "Sweets-16": "Sweets-16",
    "Limted-16": "Limted-16",
    "Astro16-v2": "Astro16-v2",
    "RGGB 4-bit color palette": "RGGB 4-bit color palette",
    "Transit": "Transit",
    "Arctic Level": "Arctic Level",
    "Intellivision": "Intellivision",
    "fourbit": "fourbit",
    "Washed-Over 16": "Washed-Over 16",
    "Colorbit-16": "Colorbit-16",
    "The Amazing Spider-Man": "The Amazing Spider-Man",
    "Bounce-16": "Bounce-16",
    "JW-64": "JW-64",
    "Light Fantasy Game": "Light Fantasy Game",
    "Doodle 16": "Doodle 16",
    "ANDREW KENSLER 16 (STYLIZED)": "ANDREW KENSLER 16 (STYLIZED)",
    "the16wonder": "the16wonder",
    "VNES-16 PALETTE": "VNES-16 PALETTE",
    "Campbell (New Windows Console)": "Campbell (New Windows Console)",
    "Pastry Shop": "Pastry Shop",
    "Super Cassette Vision": "Super Cassette Vision",
    "BoldSouls16": "BoldSouls16",
    "MG16": "MG16",
    "Minecraft Concrete": "Minecraft Concrete",
    "Rabbit Jump": "Rabbit Jump",
    "Spiral 16": "Spiral 16",
    "NanoC-16": "NanoC-16",
    "Brenyon's Rainbow": "Brenyon's Rainbow",
    "Crayon16": "Crayon16",
    "Chip's Challenge Amiga/Atari ST": "Chip's Challenge Amiga/Atari ST",
    "16Dan": "16Dan",
    "LucasArts Atari ST": "LucasArts Atari ST",
    "4-Bit RGB": "4-Bit RGB",
    "A.J.'s Pico-8 Palette": "A.J.'s Pico-8 Palette",
    "Minecraft Dyes": "Minecraft Dyes",
    "Proto 64": "Proto 64",
    "Softboy 16": "Softboy 16",
    "Cartooners": "Cartooners",
    "Pastari16": "Pastari16",
    "Huemeister": "Huemeister",
    "Ultima VI Sharp X68000 ": "Ultima VI Sharp X68000 ",
    "HWAYS-16": "HWAYS-16",
    "Vibrant ramps": "Vibrant ramps",
    "PAC-16": "PAC-16",
    "Random16": "Random16",
    "LovePal 16": "LovePal 16",
    "NYANKOS16": "NYANKOS16",
    "Sierra Adventures Atari ST": "Sierra Adventures Atari ST",
    "Race You Home!": "Race You Home!",
    "Baby Jo in \"Going Home\"": "Baby Jo in \"Going Home\"",
    "Ice Cream 16": "Ice Cream 16",
    "Andrew Kensler's 16": "Andrew Kensler's 16",
    "Krzywinski Colorblind 16": "Krzywinski Colorblind 16",
    "Supaplex": "Supaplex",
    "QAOS Minimalist 16": "QAOS Minimalist 16",
    "DOS's Gloomy Gloss": "DOS's Gloomy Gloss",
    "Newer Graphics Adapter": "Newer Graphics Adapter",
    "Super Breakout ST": "Super Breakout ST",
    "another retro": "another retro",
    "JMP (Japanese Machine Palette)": "JMP (Japanese Machine Palette)",
    "Eroge Copper": "Eroge Copper",
    "Castpixel 16": "Castpixel 16",
    "Fantasy 16": "Fantasy 16",
    "Psygnosia": "Psygnosia",
    "DinoKnight 16": "DinoKnight 16",
    "Chromatic16": "Chromatic16",
    "Arne 16": "Arne 16",
    "CGArne": "CGArne",
    "Copper Tech": "Copper Tech",
    "/r/Place": "/r/Place",
    "Night 16": "Night 16",
    "ZXArne 5.2": "ZXArne 5.2",
    "Easter Island": "Easter Island",
    "A64": "A64",
    "Grunge Shift": "Grunge Shift",
    "Fun16": "Fun16",
    "cm16": "cm16",
    "FlyGuy 16": "FlyGuy 16",
    "[thUg] 16": "[thUg] 16",
    "Naji 16": "Naji 16",
    "Andrew Kensler 16": "Andrew Kensler 16",
    "Crimso 11": "Crimso 11",
    "Chip16": "Chip16",
    "RISC OS": "RISC OS",
    "CD-BAC": "CD-BAC",
    "Super17 16": "Super17 16",
    "Master-16": "Master-16",
    "Drazile 16": "Drazile 16",
    "Optimum": "Optimum",
    "pavanz 16": "pavanz 16",
    "Thomson M05": "Thomson M05",
};

const moebius_menu = {
    label: "Mœbius",
    submenu: [
        { role: "about", label: "About Mœbius" },
        { type: "separator" },
        { label: "Preferences", id: "preferences", accelerator: "CmdorCtrl+,", click(item) { event.emit("preferences"); } },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide", label: "Hide Mœbius" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit", label: "Quit Mœbius" }
    ]
};

const bare_file = {
    label: "File",
    submenu: [
        { role: "close" }
    ]
};

const bare_edit = {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "Cmd+Z", role: "undo" },
        { label: "Redo", accelerator: "Cmd+Shift+Z", role: "redo" },
        { type: "separator" },
        { label: "Cut", accelerator: "Cmd+X", role: "cut" },
        { label: "Copy", accelerator: "Cmd+C", role: "copy" },
        { label: "Paste", accelerator: "Cmd+V", role: "paste" },
        { label: "Select All", accelerator: "Cmd+A", role: "selectall" }
    ]
};

const window_menu_items = {
    label: "Window",
    submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" }
    ]
};

const help_menu_items = {
    label: "Help", role: "help", submenu: [
        { label: "Tutorial for Moebius XBIN editor", id: "xbin_tutorial", click(item) { electron.shell.openExternal("https://blog.glyphdrawing.club/moebius-ansi-ascii-art-editor-with-custom-font-support"); } },
        { type: "separator" },
        { label: "How to Start a Server", id: "show_repo", click(item) { electron.shell.openExternal("https://github.com/blocktronics/moebius/blob/master/README.md#moebius-server"); } },
        { label: "Enable Function Keys on MacOS", id: "enable_function_keys", click(item) { electron.shell.openExternal("file:///System/Library/PreferencePanes/Keyboard.prefPane/"); }, enabled: darwin },
        { type: "separator" },
        { label: "Cheatsheet", id: "show_cheatsheet", click(item) { event.emit("show_cheatsheet"); } },
        { label: "Show Numpad Mappings", id: "show_numpad_mappings", click(item) { event.emit("show_numpad_mappings"); } },
        { type: "separator" },
        { label: "Acknowledgements", id: "show_acknowledgements", click(item) { event.emit("show_acknowledgements"); } },
        { type: "separator" },
        { label: "ANSI Art Tutorials at 16Colors", id: "changelog", click(item) { electron.shell.openExternal("https://16colo.rs/tags/content/tutorial"); } },
        { label: "Mœbius Homepage", id: "show_homepage", click(item) { electron.shell.openExternal("https://blocktronics.github.io/moebius/"); } },
        { label: "Source Code at GitHub", id: "show_repo", click(item) { electron.shell.openExternal("https://github.com/blocktronics/moebius"); } },
        { label: "Raise an Issue at GitHub", id: "show_issues", click(item) { electron.shell.openExternal("https://github.com/blocktronics/moebius/issues"); } },
        { type: "separator" },
        { label: "Changelog", id: "changelog", click(item) { event.emit("show_changelog"); } },
    ]
};

const application = electron.Menu.buildFromTemplate([moebius_menu, {
    label: "File",
    submenu: [
        { label: "New", id: "new_document", accelerator: "Cmd+N", click(item) { event.emit("new_document"); } },
        { type: "separator" },
        { label: "Open\u2026", id: "open", accelerator: "Cmd+O", click(item) { event.emit("open"); } },
        { role: "recentDocuments", submenu: [{ role: "clearRecentDocuments" }] },
        { type: "separator" },
        { role: "close" },
    ]
}, bare_edit, {
        label: "Network", submenu: [
            { label: "Connect to Server…", accelerator: "Cmd+Alt+S", id: "connect_to_server", click(item) { event.emit("show_new_connection_window"); } },
        ]
    }, window_menu_items, help_menu_items
]);

function file_menu_template(win) {
    return {
        label: "&File",
        submenu: [
            { label: "New", id: "new_document", accelerator: "CmdorCtrl+N", click(item) { event.emit("new_document"); } },
            { label: "Duplicate as New Document", id: "duplicate", click(item) { win.send("duplicate"); } },
            { type: "separator" },
            { label: "Open\u2026", id: "open", accelerator: "CmdorCtrl+O", click(item) { event.emit("open", win); } },
            { label: "Open in Current Window\u2026", id: "open_in_current_window", accelerator: "CmdorCtrl+Shift+O", click(item) { event.emit("open_in_current_window", win); } },
            darwin ? { role: "recentDocuments", submenu: [{ role: "clearRecentDocuments" }] } : ({ type: "separator" }, { label: "Settings", click(item) { event.emit("preferences"); } }),
            { type: "separator" },
            { label: "Revert to Last Save", id: "revert_to_last_save", click(item) { win.send("revert_to_last_save"); }, enabled: false },
            { label: "Show File in Folder", id: "show_file_in_folder", click(item) { win.send("show_file_in_folder"); }, enabled: false },
            { type: "separator" },
            { label: "Edit Sauce Info\u2026", id: "edit_sauce_info", accelerator: "CmdorCtrl+I", click(item) { win.send("get_sauce_info"); } },
            { type: "separator" },
            { label: "Save", id: "save", accelerator: "CmdorCtrl+S", click(item) { win.send("save"); } },
            { label: "Save As\u2026", id: "save_as", accelerator: "CmdorCtrl+Shift+S", click(item) { win.send("save_as"); } },
            { label: "Save Without Sauce Info\u2026", id: "save_without_sauce", click(item) { win.send("save_without_sauce"); } },
            { type: "separator" },
            { label: "Share Online", id: "share_online", click(item) { win.send("share_online"); } },
            { label: "Share Online (XBIN)", id: "share_online_xbin", click(item) { win.send("share_online_xbin"); } },
            { type: "separator" },
            { label: "Export As PNG\u2026", id: "export_as_png", accelerator: "CmdorCtrl+Shift+E", click(item) { win.send("export_as_png"); } },
            { label: "Export As Animated PNG\u2026", id: "export_as_apng", accelerator: "CmdorCtrl+Shift+A", click(item) { win.send("export_as_apng"); } },
            { type: "separator" },
            { label: "Export As UTF-8\u2026", id: "export_as_utf8", accelerator: "CmdorCtrl+Shift+U", click(item) { win.send("export_as_utf8"); } },
            { type: "separator" },
            { role: "close", accelerator: darwin ? "Cmd+W" : "Alt+F4" }
        ]
    };
}

function edit_menu_template(win, chat) {
    return {
        label: "&Edit",
        submenu: [
            chat ? { label: "Undo", accelerator: "Cmd+Z", role: "undo" } : { label: "Undo", id: "undo", accelerator: darwin ? "CmdorCtrl+Z" : "", click(item) { win.send("undo"); }, enabled: false },
            chat ? { label: "Redo", accelerator: "Cmd+Shift+Z", role: "redo" } : { label: "Redo", id: "redo", accelerator: darwin ? "CmdorCtrl+Shift+Z" : "", click(item) { win.send("redo"); }, enabled: false },
            { type: "separator" },
            { label: "Toggle Insert Mode", id: "toggle_insert_mode", accelerator: darwin ? "" : "Insert", type: "checkbox", click(item) { win.send("insert_mode", item.checked); }, checked: false },
            { label: "Toggle Overwrite Mode", id: "overwrite_mode", accelerator: "CmdorCtrl+Alt+O", click(item) { win.send("overwrite_mode", item.checked); }, type: "checkbox", checked: false },
            { type: "separator" },
            { label: "Mirror Mode", id: "mirror_mode", accelerator: "CmdorCtrl+Alt+M", click(item) { win.send("mirror_mode", item.checked); }, type: "checkbox", checked: false },
            { type: "separator" },
            chat ? { label: "Cut", accelerator: "Cmd+X", role: "cut" } : { label: "Cut", id: "cut", accelerator: "CmdorCtrl+X", click(item) { win.send("cut"); }, enabled: false },
            chat ? { label: "Copy", accelerator: "Cmd+C", role: "copy" } : { label: "Copy", id: "copy", accelerator: "CmdorCtrl+C", click(item) { win.send("copy"); }, enabled: false },
            chat ? { label: "Paste", accelerator: "Cmd+V", role: "paste" } : { label: "Paste", id: "paste", accelerator: "CmdorCtrl+V", click(item) { win.send("paste"); }, enabled: true },
            { label: "Paste As Selection", id: "paste_as_selection", accelerator: "CmdorCtrl+Alt+V", click(item) { win.send("paste_as_selection"); }, enabled: true },
            { type: "separator" },
            { label: "Left Justify Line", id: "left_justify_line", accelerator: "Alt+L", click(item) { win.send("left_justify_line"); }, enabled: true },
            { label: "Right Justify Line", id: "right_justify_line", accelerator: "Alt+R", click(item) { win.send("right_justify_line"); }, enabled: true },
            { label: "Center Line", id: "center_line", accelerator: "Alt+C", click(item) { win.send("center_line"); }, enabled: true },
            { type: "separator" },
            { label: "Insert Row", id: "insert_row", accelerator: "Alt+Up", click(item) { win.send("insert_row"); }, enabled: true },
            { label: "Delete Row", id: "delete_row", accelerator: "Alt+Down", click(item) { win.send("delete_row"); }, enabled: true },
            { type: "separator" },
            { label: "Insert Column", id: "insert_column", accelerator: "Alt+Right", click(item) { win.send("insert_column"); }, enabled: true },
            { label: "Delete Column", id: "delete_column", accelerator: "Alt+Left", click(item) { win.send("delete_column"); }, enabled: true },
            { type: "separator" },
            { label: "Erase Row", id: "erase_line", accelerator: "Alt+E", click(item) { win.send("erase_line"); }, enabled: true },
            { label: "Erase to Start of Row", id: "erase_to_start_of_line", accelerator: "Alt+Home", click(item) { win.send("erase_to_start_of_line"); }, enabled: true },
            { label: "Erase to End of Row", id: "erase_to_end_of_line", accelerator: "Alt+End", click(item) { win.send("erase_to_end_of_line"); }, enabled: true },
            { type: "separator" },
            { label: "Erase Column", id: "erase_column", accelerator: "Alt+Shift+E", click(item) { win.send("erase_column"); }, enabled: true },
            { label: "Erase to Start of Column", id: "erase_to_start_of_column", accelerator: "Alt+PageUp", click(item) { win.send("erase_to_start_of_column"); }, enabled: true },
            { label: "Erase to End of Column", id: "erase_to_end_of_column", accelerator: "Alt+PageDown", click(item) { win.send("erase_to_end_of_column"); }, enabled: true },
            { type: "separator" },
            { label: "Scroll Canvas Up", id: "scroll_canvas_up", accelerator: "Ctrl+Alt+Up", click(item) { win.send("scroll_canvas_up"); }, enabled: true },
            { label: "Scroll Canvas Down", id: "scroll_canvas_down", accelerator: "Ctrl+Alt+Down", click(item) { win.send("scroll_canvas_down"); }, enabled: true },
            { label: "Scroll Canvas Right", id: "scroll_canvas_right", accelerator: "Ctrl+Alt+Right", click(item) { win.send("scroll_canvas_right"); }, enabled: true },
            { label: "Scroll Canvas Left", id: "scroll_canvas_left", accelerator: "Ctrl+Alt+Left", click(item) { win.send("scroll_canvas_left"); }, enabled: true },
            { type: "separator" },
            { label: "Set Canvas Size\u2026", id: "set_canvas_size", accelerator: "CmdorCtrl+Alt+C", click(item) { win.send("get_canvas_size"); }, enabled: true },
        ]
    };
}

function selection_menu_template(win, chat) {
    return {
        label: "&Selection",
        submenu: [
            chat ? { label: "Select All", accelerator: "Cmd+A", role: "selectall" } : { label: "Select All", id: "select_all", accelerator: "CmdorCtrl+A", click(item) { win.send("select_all"); } },
            { label: "Deselect", id: "deselect", click(item) { win.send("deselect"); }, enabled: false },
            { type: "separator" },
            { label: "Import\u2026", id: "import_selection", click(item) { win.send("import_selection"); } },
            { label: "Export\u2026", id: "export_selection", click(item) { win.send("export_selection"); }, enabled: false },
            { type: "separator" },
            { label: "Start Selection", id: "start_selection", accelerator: "Alt+B", click(item) { win.send("start_selection"); }, enabled: false },
            { type: "separator" },
            { label: "Move Block", id: "move_block", accelerator: "M", click(item) { win.send("move_block"); }, enabled: false },
            { label: "Copy Block", id: "copy_block", accelerator: "C", click(item) { win.send("copy_block"); }, enabled: false },
            { type: "separator" },
            { label: "Fill", id: "fill", accelerator: "F", click(item) { win.send("fill"); }, enabled: false },
            { label: "Erase", id: "erase", accelerator: "E", click(item) { win.send("erase"); }, enabled: false },
            { label: "Stamp", id: "stamp", accelerator: "S", click(item) { win.send("stamp"); }, enabled: false },
            { label: "Place", id: "place", accelerator: "Enter", click(item) { win.send("place"); }, enabled: false },
            { label: "Rotate", id: "rotate", accelerator: "R", click(item) { win.send("rotate"); }, enabled: false },
            { label: "Flip X", id: "flip_x", accelerator: "X", click(item) { win.send("flip_x"); }, enabled: false },
            { label: "Flip Y", id: "flip_y", accelerator: "Y", click(item) { win.send("flip_y"); }, enabled: false },
            { label: "Center", id: "center", accelerator: "=", click(item) { win.send("center"); }, enabled: false },
            { type: "separator" },
            { label: "Transparent", id: "transparent", accelerator: "T", click(item) { win.send("transparent", item.checked); }, type: "checkbox", checked: false, enabled: false },
            { label: "Over", id: "over", accelerator: "O", click(item) { win.send("over", item.checked); }, type: "checkbox", checked: false, enabled: false },
            { label: "Underneath", id: "underneath", accelerator: "U", click(item) { win.send("underneath", item.checked); }, type: "checkbox", checked: false, enabled: false },
            { type: "separator" },
            { label: "Crop", id: "crop", accelerator: "CmdorCtrl+K", click(item) { win.send("crop"); }, enabled: false },
        ]
    };
}

function lospec_palette_menu_items(win) {
    return Object.keys(lospec_palette_list).map((lospec_palette_name) => {
        return { label: lospec_palette_name, id: lospec_palette_name, click(item) { win.send("change_palette", lospec_palette_name); }, type: "checkbox", checked: false };
    });
}

function viler_font_menu_items(win) {
    return Object.keys(viler_font_list).map((menu_title) => {
        return {
            label: menu_title, submenu: Object.keys(viler_font_list[menu_title]).map((font_name) => {
                return { label: font_name, id: font_name, click(item) { win.send("change_font", font_name); }, type: "checkbox", checked: false };
            })
        };
    });
}

function font_menu_items(win) {
    return Object.keys(font_list).map((menu_title) => {
        return {
            label: menu_title, submenu: Object.keys(font_list[menu_title]).map((font_name) => {
                return { label: `${font_name} (8×${font_list[menu_title][font_name]})`, id: font_name, click(item) { win.send("change_font", font_name); }, type: "checkbox", checked: false };
            })
        };
    });
}

function view_menu_template(win) {
    return {
        label: "&View",
        submenu: [
            { label: "Keyboard Mode", id: "change_to_select_mode", accelerator: "K", click(item) { win.send("change_to_select_mode"); }, enabled: false },
            { label: "Brush Mode", id: "change_to_brush_mode", accelerator: "B", click(item) { win.send("change_to_brush_mode"); }, enabled: false },
            { label: "Shifter Mode", id: "change_to_shifter_mode", accelerator: "I", click(item) { win.send("change_to_shifter_mode"); }, enabled: false },
            { label: "Paintbucket Mode", id: "change_to_fill_mode", accelerator: "P", click(item) { win.send("change_to_fill_mode"); }, enabled: false },
            { type: "separator" },
            { label: "Show Status Bar", id: "show_status_bar", accelerator: "CmdorCtrl+/", click(item) { win.send("show_statusbar", item.checked); }, type: "checkbox", checked: true },
            { label: "Show Tool Bar", id: "show_tool_bar", accelerator: "CmdorCtrl+T", click(item) { win.send("show_toolbar", item.checked); }, type: "checkbox", checked: true },
            { label: "Hide Preview", id: "show_preview", accelerator: "CmdorCtrl+Alt+P", click(item) { win.send("show_preview", item.checked); }, type: "checkbox", checked: true },
            { type: "separator" },
            { label: "Previous Character Set", id: "previous_character_set", accelerator: "Ctrl+,", click(item) { win.send("previous_character_set"); }, enabled: true },
            { label: "Next Character Set", id: "next_character_set", accelerator: "Ctrl+.", click(item) { win.send("next_character_set"); }, enabled: true },
            { label: "Default Character Set", id: "default_character_set", accelerator: "Ctrl+/", click(item) { win.send("default_character_set"); }, enabled: true },
            { type: "separator" },
            { label: "Increase Brush Size", id: "increase_brush_size", accelerator: "Alt+=", click(item) { win.send("increase_brush_size"); }, enabled: false },
            { label: "Decrease Brush Size", id: "decrease_brush_size", accelerator: "Alt+-", click(item) { win.send("decrease_brush_size"); }, enabled: false },
            { label: "Reset Brush Size", id: "reset_brush_size", accelerator: "Alt+0", click(item) { win.send("reset_brush_size"); }, enabled: false },
            { type: "separator" },
            { label: "Use 9px Font", id: "use_9px_font", accelerator: "CmdorCtrl+F", click(item) { win.send("use_9px_font", item.checked); }, type: "checkbox", checked: false },
            { type: "separator" },
            { label: "View canvas at 200%", id: "canvas_zoom_toggle", accelerator: "CmdorCtrl+Alt+2", click(item) { win.send("canvas_zoom_toggle"); }, type: "checkbox", checked: false },
            { label: "Actual Size", id: "actual_size", accelerator: "CmdorCtrl+Alt+0", click(item) { win.send("actual_size"); }, type: "checkbox", checked: false },
            { label: "Zoom In", id: "zoom_in", accelerator: "CmdorCtrl+=", click(item) { win.send("zoom_in"); } },
            { label: "Zoom Out", id: "zoom_out", accelerator: "CmdorCtrl+-", click(item) { win.send("zoom_out"); } },
            { type: "separator" },
            {
                label: "Guides", submenu: [
                    { label: "Smallscale (80×25)", id: "smallscale_guide", click(item) { win.send("toggle_smallscale_guide", item.checked); }, type: "checkbox", checked: false },
                    { label: "Square (80×40)", id: "square_guide", click(item) { win.send("toggle_square_guide", item.checked); }, type: "checkbox", checked: false },
                    { label: "Instagram (80×50)", id: "instagram_guide", click(item) { win.send("toggle_instagram_guide", item.checked); }, type: "checkbox", checked: false },
                    { label: "File ID (44×22)", id: "file_id_guide", click(item) { win.send("toggle_file_id_guide", item.checked); }, type: "checkbox", checked: false },
                    { label: "PETSCII (40×25)", id: "petscii_guide", click(item) { win.send("toggle_petscii_guide", item.checked); }, type: "checkbox", checked: false },
                    {
                        label: "Drawing grid", submenu: [
                            { label: "4x2", id: "drawinggrid_4x2", click(item) { win.send("toggle_drawinggrid", item.checked, 4); }, type: "checkbox", checked: false },
                            { label: "6x3", id: "drawinggrid_6x3", click(item) { win.send("toggle_drawinggrid", item.checked, 6); }, type: "checkbox", checked: false },
                            { label: "8x4", id: "drawinggrid_8x4", click(item) { win.send("toggle_drawinggrid", item.checked, 8); }, type: "checkbox", checked: false },
                            { label: "12x6", id: "drawinggrid_12x6", click(item) { win.send("toggle_drawinggrid", item.checked, 12); }, type: "checkbox", checked: false },
                            { label: "16x8", id: "drawinggrid_16x8", click(item) { win.send("toggle_drawinggrid", item.checked, 16); }, type: "checkbox", checked: false },
                        ]
                    },
                ]
            },
            { type: "separator" },
            { label: "Open Reference Image\u2026", id: "open_reference_image", accelerator: "CmdorCtrl+Shift+O", click(item) { win.send("open_reference_image"); } },
            { label: "Toggle Reference Image", id: "toggle_reference_image", accelerator: "Ctrl+Tab", click(item) { win.send("toggle_reference_image", item.checked); }, enabled: false, type: "checkbox", checked: true },
            { label: "Clear", id: "clear_reference_image", click(item) { win.send("clear_reference_image"); }, enabled: false },
            { type: "separator" },
            { label: "Scroll Document With Cursor", id: "scroll_document_with_cursor", accelerator: "CmdorCtrl+R", click(item) { win.send("scroll_document_with_cursor", item.checked); }, type: "checkbox", checked: false },
            { type: "separator" },
            { role: "togglefullscreen", accelerator: "CmdorCtrl+Alt+F" },
        ]
    };
}

function font_menu_template(win) {
    return {
        label: "&Font",
        submenu: [
            { label: "Show Character List", id: "show_charlist", accelerator: "CmdorCtrl+Alt+L", click(item) { win.send("show_charlist", item.checked); }, type: "checkbox", checked: true },
            { type: "separator" },
            { label: "Change Font", submenu: font_menu_items(win) },
            { label: "Viler's VGA textmode fonts", submenu: viler_font_menu_items(win) },
            { label: "Load Custom Font\u2026", id: "loadcustomfont", click(item) { win.send("load_custom_font"); } },
            { label: "Reset to default font\u2026", id: "resetxbinfont", click(item) { win.send("change_font", "IBM VGA"); } },
            { label: "Export font\u2026", id: "export_font", click(item) { win.send("export_font"); } },
            { label: "Import font from image (GIF/PNG)\u2026", id: "import_font", click(item) { win.send("import_font"); } },
            { type: "separator" },
            { label: "How to make yourn own character set", id: "customfont_tutorial", click(item) { electron.shell.openExternal("https://blog.glyphdrawing.club/moebius-ansi-ascii-art-editor-with-custom-font-support"); } },

        ]
    };
}

function colors_menu_template(win) {
    return {
        label: "Colors",
        submenu: [
            { label: "Load Lospec palette", submenu: lospec_palette_menu_items(win) },
            { type: "separator" },
            { label: "Select Attribute", id: "select_attribute", accelerator: "Alt+A", click(item) { win.send("select_attribute"); } },
            { type: "separator" },
            { label: "Previous Foreground Color", id: "previous_foreground_color", accelerator: "Ctrl+Up", click(item) { win.send("previous_foreground_color"); } },
            { label: "Next Foreground Color", id: "next_foreground_color", accelerator: "Ctrl+Down", click(item) { win.send("next_foreground_color"); } },
            { type: "separator" },
            { label: "Previous Background Color", id: "previous_background_colour", accelerator: "Ctrl+Left", click(item) { win.send("previous_background_color"); } },
            { label: "Next Background Color", id: "next_background_color", accelerator: "Ctrl+Right", click(item) { win.send("next_background_color"); } },
            { type: "separator" },
            { label: "Use Attribute Under Cursor", id: "use_attribute_under_cursor", accelerator: "Alt+U", click(item) { win.send("use_attribute_under_cursor"); } },
            { label: "Default Color", id: "default_color", accelerator: "CmdorCtrl+D", click(item) { win.send("default_color"); } },
            { label: "Switch Foreground / Background", id: "switch_foreground_background", accelerator: "Alt+X", click(item) { win.send("switch_foreground_background"); } },
            { type: "separator" },
            { label: "Use iCE Colors (stop blinking)", id: "ice_colors", accelerator: "CmdorCtrl+E", click(item) { win.send("ice_colors", item.checked); }, type: "checkbox", checked: true },
            { type: "separator" },
            { label: "Remove iCE Colors as New Document", id: "remove_ice_colors", click(item) { win.send("remove_ice_colors"); } },
        ]
    };
}

function network_menu_template(win, enabled) {
    return {
        label: "&Network", submenu: [
            { label: "Connect to Server…", id: "connect_to_server", accelerator: "CmdorCtrl+Alt+S", click(item) { event.emit("show_new_connection_window"); } },
            { type: "separator" },
            { label: "Toggle Chat Window", id: "chat_window_toggle", accelerator: "CmdorCtrl+[", click(item) { win.send("chat_window_toggle"); }, enabled },
        ]
    };
}

function debug_menu_template(win) {
    return {
        label: "Debug",
        submenu: [
            { label: "Open Dev Tools", id: "open_dev_tools", click(item) { win.openDevTools({ mode: "detach" }); } }
        ]
    };
}

function create_menu_template(win, chat, debug) {
    const menu_lists = [file_menu_template(win), edit_menu_template(win, chat), selection_menu_template(win, chat), colors_menu_template(win), font_menu_template(win), view_menu_template(win), network_menu_template(win, chat)];
    if (debug) menu_lists.push(debug_menu_template(win));
    return menu_lists;
}

function get_menu_item(id, name) {
    return menus[id].getMenuItemById(name);
}

function get_chat_menu_item(id, name) {
    return chat_menus[id].getMenuItemById(name);
}

function enable(id, name) {
    get_menu_item(id, name).enabled = true;
    if (name != "cut" && name != "copy" && name != "paste" && name != "undo" && name != "redo" && name != "select_all") get_chat_menu_item(id, name).enabled = true;
}

function disable(id, name) {
    get_menu_item(id, name).enabled = false;
    if (name != "cut" && name != "copy" && name != "paste" && name != "undo" && name != "redo" && name != "select_all") get_chat_menu_item(id, name).enabled = false;
}

function check(id, name) {
    get_menu_item(id, name).checked = true;
    get_chat_menu_item(id, name).checked = true;
}

function uncheck(id, name) {
    get_menu_item(id, name).checked = false;
    get_chat_menu_item(id, name).checked = false;
}

function set_check(id, name, value) {
    get_menu_item(id, name).checked = value;
    get_chat_menu_item(id, name).checked = value;
}

electron.ipcMain.on("set_file", (event, { id }) => {
    enable(id, "show_file_in_folder");
    enable(id, "revert_to_last_save");
});

electron.ipcMain.on("enable_undo", (event, { id }) => {
    enable(id, "undo");
});

electron.ipcMain.on("disable_undo", (event, { id }) => {
    disable(id, "undo");
});

electron.ipcMain.on("enable_redo", (event, { id }) => {
    enable(id, "redo");
});

electron.ipcMain.on("disable_redo", (event, { id }) => {
    disable(id, "redo");
});

electron.ipcMain.on("enable_reference_image", (event, { id }) => {
    enable(id, "toggle_reference_image");
    check(id, "toggle_reference_image");
    enable(id, "clear_reference_image");
});

electron.ipcMain.on("disable_clear_reference_image", (event, { id }) => {
    disable(id, "toggle_reference_image");
    disable(id, "clear_reference_image");
});

electron.ipcMain.on("enable_selection_menu_items", (event, { id }) => {
    enable(id, "cut");
    enable(id, "copy");
    enable(id, "erase");
    enable(id, "fill");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    enable(id, "deselect");
    enable(id, "move_block");
    enable(id, "copy_block");
    enable(id, "crop");
    enable(id, "export_selection");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "use_attribute_under_cursor");
    disable(id, "start_selection");
    disable(id, "select_attribute");
});

function disable_selection_menu_items(id) {
    disable(id, "cut");
    disable(id, "copy");
    disable(id, "erase");
    disable(id, "fill");
    disable(id, "deselect");
    disable(id, "move_block");
    disable(id, "copy_block");
    disable(id, "crop");
    disable(id, "export_selection");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    enable(id, "left_justify_line");
    enable(id, "right_justify_line");
    enable(id, "center_line");
    enable(id, "erase_line");
    enable(id, "erase_to_start_of_line");
    enable(id, "erase_to_end_of_line");
    enable(id, "erase_column");
    enable(id, "erase_to_start_of_column");
    enable(id, "erase_to_end_of_column");
    enable(id, "insert_row");
    enable(id, "delete_row");
    enable(id, "insert_column");
    enable(id, "delete_column");
    enable(id, "scroll_canvas_up");
    enable(id, "scroll_canvas_down");
    enable(id, "scroll_canvas_left");
    enable(id, "scroll_canvas_right");
    enable(id, "use_attribute_under_cursor");
    enable(id, "start_selection");
}

electron.ipcMain.on("disable_selection_menu_items", (event, { id }) => disable_selection_menu_items(id));

electron.ipcMain.on("disable_selection_menu_items_except_deselect_and_crop", (event, { id }) => {
    disable_selection_menu_items(id);
    enable(id, "deselect");
    enable(id, "crop");
    enable(id, "export_selection");
});

electron.ipcMain.on("enable_operation_menu_items", (event, { id }) => {
    enable(id, "stamp");
    enable(id, "place");
    enable(id, "rotate");
    enable(id, "flip_x");
    enable(id, "flip_y");
    enable(id, "center");
    enable(id, "transparent");
    enable(id, "over");
    check(id, "over");
    enable(id, "underneath");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    disable(id, "use_attribute_under_cursor");
    disable(id, "start_selection");
});

function disable_operation_menu_items(id) {
    disable(id, "stamp");
    disable(id, "place");
    disable(id, "rotate");
    disable(id, "flip_x");
    disable(id, "flip_y");
    disable(id, "center");
    disable(id, "transparent");
    uncheck(id, "transparent");
    disable(id, "over");
    uncheck(id, "over");
    disable(id, "underneath");
    uncheck(id, "underneath");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    enable(id, "use_attribute_under_cursor");
}

electron.ipcMain.on("disable_operation_menu_items", (event, { id }) => disable_operation_menu_items(id));

electron.ipcMain.on("disable_editing_shortcuts", (event, { id }) => {
    disable_selection_menu_items(id);
    disable_operation_menu_items(id);
    disable(id, "use_attribute_under_cursor");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    enable(id, "change_to_select_mode");
    enable(id, "change_to_brush_mode");
    enable(id, "change_to_shifter_mode");
    enable(id, "change_to_fill_mode");
    disable(id, "previous_character_set");
    disable(id, "next_character_set");
    disable(id, "default_character_set");
    disable(id, "start_selection");
});

electron.ipcMain.on("enable_editing_shortcuts", (event, { id }) => {
    disable_selection_menu_items(id);
    disable_operation_menu_items(id);
    enable(id, "use_attribute_under_cursor");
    enable(id, "left_justify_line");
    enable(id, "right_justify_line");
    enable(id, "center_line");
    enable(id, "erase_line");
    enable(id, "erase_to_start_of_line");
    enable(id, "erase_to_end_of_line");
    enable(id, "erase_column");
    enable(id, "erase_to_start_of_column");
    enable(id, "erase_to_end_of_column");
    enable(id, "insert_row");
    enable(id, "delete_row");
    enable(id, "insert_column");
    enable(id, "delete_column");
    enable(id, "scroll_canvas_up");
    enable(id, "scroll_canvas_down");
    enable(id, "scroll_canvas_left");
    enable(id, "scroll_canvas_right");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    disable(id, "change_to_select_mode");
    disable(id, "change_to_brush_mode");
    disable(id, "change_to_shifter_mode");
    disable(id, "change_to_fill_mode");
    enable(id, "previous_character_set");
    enable(id, "next_character_set");
    enable(id, "default_character_set");
    enable(id, "start_selection");
    enable(id, "select_attribute");
});

electron.ipcMain.on("update_menu_checkboxes", (event, { id, insert_mode, overwrite_mode, use_9px_font, ice_colors, actual_size, font_name, lospec_palette_name }) => {
    if (insert_mode != undefined) set_check(id, "toggle_insert_mode", insert_mode);
    if (overwrite_mode != undefined) set_check(id, "overwrite_mode", overwrite_mode);
    if (use_9px_font != undefined) set_check(id, "use_9px_font", use_9px_font);
    if (ice_colors != undefined) set_check(id, "ice_colors", ice_colors);
    if (actual_size != undefined) set_check(id, "actual_size", actual_size);
    if (lospec_palette_name != undefined) {
        if (lospec_palette_names[id]) uncheck(id, lospec_palette_names[id]);
        if (get_menu_item(id, lospec_palette_name)) {
            check(id, lospec_palette_name);
            lospec_palette_names[id] = lospec_palette_name;
        }
    }
    if (font_name != undefined) {
        if (font_names[id]) uncheck(id, font_names[id]);
        if (get_menu_item(id, font_name)) {
            check(id, font_name);
            font_names[id] = font_name;
        }
    }
});

electron.ipcMain.on("uncheck_transparent", (event, { id }) => uncheck(id, "transparent"));
electron.ipcMain.on("uncheck_underneath", (event, { id }) => uncheck(id, "underneath"));
electron.ipcMain.on("check_underneath", (event, { id }) => check(id, "underneath"));
electron.ipcMain.on("uncheck_over", (event, { id }) => uncheck(id, "over"));
electron.ipcMain.on("check_over", (event, { id }) => check(id, "over"));

electron.ipcMain.on("check_smallscale_guide", (event, { id }) => check(id, "smallscale_guide"));
electron.ipcMain.on("check_square_guide", (event, { id }) => check(id, "square_guide"));
electron.ipcMain.on("check_instagram_guide", (event, { id }) => check(id, "instagram_guide"));
electron.ipcMain.on("check_file_id_guide", (event, { id }) => check(id, "file_id_guide"));
electron.ipcMain.on("check_petscii_guide", (event, { id }) => check(id, "petscii_guide"));
electron.ipcMain.on("check_drawinggrid_4x2", (event, { id }) => check(id, "drawinggrid_4x2"));
electron.ipcMain.on("check_drawinggrid_6x3", (event, { id }) => check(id, "drawinggrid_6x3"));
electron.ipcMain.on("check_drawinggrid_8x4", (event, { id }) => check(id, "drawinggrid_8x4"));
electron.ipcMain.on("check_drawinggrid_12x6", (event, { id }) => check(id, "drawinggrid_12x6"));
electron.ipcMain.on("check_drawinggrid_16x8", (event, { id }) => check(id, "drawinggrid_16x8"));
electron.ipcMain.on("uncheck_all_guides", (event, { id }) => {
    uncheck(id, "smallscale_guide");
    uncheck(id, "square_guide");
    uncheck(id, "instagram_guide");
    uncheck(id, "file_id_guide");
    uncheck(id, "petscii_guide");
    uncheck(id, "drawinggrid_4x2");
    uncheck(id, "drawinggrid_6x3");
    uncheck(id, "drawinggrid_8x4");
    uncheck(id, "drawinggrid_12x6");
    uncheck(id, "drawinggrid_16x8");
});

electron.ipcMain.on("enable_chat_window_toggle", (event, { id }) => {
    enable(id, "chat_window_toggle");
    check(id, "chat_window_toggle");
});

electron.ipcMain.on("enable_brush_size_shortcuts", (event, { id }) => {
    enable(id, "increase_brush_size");
    enable(id, "decrease_brush_size");
    enable(id, "reset_brush_size");
});

electron.ipcMain.on("disable_brush_size_shortcuts", (event, { id }) => {
    disable(id, "increase_brush_size");
    disable(id, "decrease_brush_size");
    disable(id, "reset_brush_size");
});

class MenuEvent extends events.EventEmitter {
    set_application_menu() {
        if (darwin) electron.Menu.setApplicationMenu(application);
    }

    chat_input_menu(win, debug) {
        const menu = darwin ? electron.Menu.buildFromTemplate([moebius_menu, ...create_menu_template(win, true, debug), window_menu_items, help_menu_items]) : electron.Menu.buildFromTemplate([...create_menu_template(win, true, debug), help_menu_items]);
        chat_menus[win.id] = menu;
        return menu;
    }

    get modal_menu() {
        return electron.Menu.buildFromTemplate([moebius_menu, bare_file, bare_edit, window_menu_items, help_menu_items]);
    }

    document_menu(win, debug) {
        const menu = darwin ? electron.Menu.buildFromTemplate([moebius_menu, ...create_menu_template(win, false, debug), window_menu_items, help_menu_items]) : electron.Menu.buildFromTemplate([...create_menu_template(win, false, debug), help_menu_items]);
        menus[win.id] = menu;
        return menu;
    }

    get dock_menu() {
        return electron.Menu.buildFromTemplate([
            { label: "New Document", click(item) { event.emit("new_document"); } },
            { label: "Open\u2026", click(item) { event.emit("open"); } },
            { label: "Preferences", click(item) { event.emit("preferences"); } },
            { label: "Connect to Server…", click(item) { event.emit("show_new_connection_window"); } }
        ]);
    }

    cleanup(id) {
        delete menus[id];
        delete font_names[id];
        delete lospec_palette_names[id];
    }
}

const event = new MenuEvent();

module.exports = event;
