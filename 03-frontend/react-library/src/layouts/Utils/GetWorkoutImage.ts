export const GetWorkoutImage = (imgName?: string): string => {
    if (!imgName) return require('../../Images/ExerciseImages/barbellrow.jpg');

    if (imgName.startsWith('data:')) {
        return imgName;
    }

    try {
        return require(`../../Images/ExerciseImages/${imgName}`);
    } catch (error) {
        return require('../../Images/ExerciseImages/barbellrow.jpg');
    }
}