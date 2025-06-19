import { readFileSync, writeFileSync, existsSync } from 'fs';
import { config } from '../config.js';

class BirthdayService {
  constructor() {
    this.dataFile = config.dataFile;
    this.initializeDataFile();
  }

  initializeDataFile() {
    if (!existsSync(this.dataFile)) {
      this.saveBirthdays({});
    }
  }

  getBirthdays() {
    try {
      const data = readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading birthdays file:', error);
      return {};
    }
  }

  saveBirthdays(birthdays) {
    try {
      writeFileSync(this.dataFile, JSON.stringify(birthdays, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving birthdays file:', error);
      return false;
    }
  }

  addBirthday(name, month, day, image, creator) {
    const birthdays = this.getBirthdays();
    
    // Check for duplicates
    if (this.characterExists(name, creator)) {
      throw new Error(config.errors.duplicateCharacter);
    }

    // Ensure month array exists
    if (!birthdays[month]) {
      birthdays[month] = [];
    }

    // Add the birthday
    birthdays[month].push({
      date: day.toString(),
      name,
      image,
      creator,
      createdAt: new Date().toISOString()
    });

    if (!this.saveBirthdays(birthdays)) {
      throw new Error('Failed to save birthday data');
    }

    return true;
  }

  deleteBirthday(name, creator) {
    const birthdays = this.getBirthdays();
    let deleted = false;

    for (const month in birthdays) {
      const index = birthdays[month].findIndex(b => 
        b.name === name && b.creator === creator
      );
      
      if (index !== -1) {
        birthdays[month].splice(index, 1);
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      throw new Error(config.errors.characterNotFound);
    }

    if (!this.saveBirthdays(birthdays)) {
      throw new Error('Failed to save birthday data');
    }

    return true;
  }

  editBirthday(name, newMonth, newDay, creator, newImage) {
    const birthdays = this.getBirthdays();
    let character = null;
    let oldMonth = null;

    // Find the character
    for (const month in birthdays) {
      const index = birthdays[month].findIndex(b => 
        b.name === name && b.creator === creator
      );
      
      if (index !== -1) {
        character = birthdays[month][index];
        oldMonth = month;
        birthdays[month].splice(index, 1);
        break;
      }
    }

    if (!character) {
      throw new Error(config.errors.characterNotFound);
    }

    // Update character data
    character.date = newDay.toString();
    if (newImage) {
      character.image = newImage;
    }
    character.updatedAt = new Date().toISOString();

    // Add to new month
    if (!birthdays[newMonth]) {
      birthdays[newMonth] = [];
    }
    birthdays[newMonth].push(character);

    if (!this.saveBirthdays(birthdays)) {
      throw new Error('Failed to save birthday data');
    }

    return true;
  }

  characterExists(name, creator) {
    const birthdays = this.getBirthdays();
    
    for (const month in birthdays) {
      if (birthdays[month].some(b => b.name === name && b.creator === creator)) {
        return true;
      }
    }
    
    return false;
  }

  getCharactersByCreator(creator) {
    const birthdays = this.getBirthdays();
    const characters = [];

    for (const month in birthdays) {
      birthdays[month].forEach(b => {
        if (b.creator === creator) {
          characters.push({
            ...b,
            month
          });
        }
      });
    }

    return characters;
  }

  getBirthdaysForDate(month, day) {
    const birthdays = this.getBirthdays();
    return birthdays[month]?.filter(b => parseInt(b.date) === day) || [];
  }

  getAllCharacters() {
    const birthdays = this.getBirthdays();
    const characters = [];

    for (const month in birthdays) {
      birthdays[month].forEach(b => {
        characters.push({
          ...b,
          month
        });
      });
    }

    return characters;
  }
}

export const birthdayService = new BirthdayService(); 