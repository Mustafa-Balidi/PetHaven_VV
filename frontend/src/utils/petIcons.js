const SPECIES_ICON = {
  dog: "sound_detection_dog_barking",
  cat: "cruelty_free",
  bird: "flutter_dash",
};

export function speciesIcon(species = "") {
  return SPECIES_ICON[species.toLowerCase()] ?? "pets";
}
