import { get } from 'http';
import { auth, db } from '../config/config';
import { firebase } from 'firebase/app';
// import 'firebase/firestore';

const lectureService = {
    storeLecture: async ({ uid, data }) => {
        try {
            console.log(uid, data);
            const docRef = db.collection('lecture').doc(uid);
            const lectures = (await docRef.get())
            if (lectures.exists) {
                await docRef.update({ lectures: [...lectures.data().lectures, data] });
                console.log('lecture updated');
            } else {
                await docRef.set({ lectures: [data] });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getLectures: async (uid) => {
        try {
            const snapshot = await db.collection('lecture').doc(uid).get();
            return snapshot.data()?.lectures || [];
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    validateLecture: async (data) => {
        const { uid, lectureId, role, teacherId } = data;

        console.log(data);
        try {
            if (role !== 'teacher' && role !== 'student') {
                return { result: "invalid", message: 'Invalid role' };
            }
            const userData = await db.collection(role).doc(uid).get();
            const lectureData = await db.collection('lecture').doc(role === "teacher" ? uid : teacherId).get();
            const lecture = lectureData.data().lectures.find(lecture => lecture.id === lectureId);

            if (!userData.exists) {
                return { result: "invalid", message: 'User not found' };
            } else if (!lecture) {
                return { result: "invalid", message: 'Lecture not found' };
            } else if (lecture.status === 'in-progress' && role === 'teacher' && lecture.teacherId !== uid) {
                return { result: "invalid", message: 'Lecture is in progress' };
            } else {
                return { result: "success", message: 'Success' };
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    updateLecture: async (uid, lecture) => {
        try {
            const lectureData = await db.collection('lecture').doc(uid).get();
            const originLectures = lectureData.data().lectures;
            const updatedLectures = originLectures.map(originLecture => (originLecture.id === lecture.id ? { ...originLecture, ...lecture } : originLecture));
            return await db.collection('lecture').doc(uid).update({ lectures: updatedLectures });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    deleteLecture: async (lecture) => {
        const lectureData = await db('lectures').where('id', lecture.id).del();
        return lectureData;
    },
    getFreeLecture: async () => {
        try {
            console.log('getFreeLecture');
            const snapshot = await db.collection('lecture').get();
            const docs = snapshot.docs.reduce((total, doc) => [...total, ...doc.data().lectures], []);
            const freeLectures = docs.filter(lecture => lecture.type === 'FREE');
            const mapToLectureInfo = async () => {
                const lectureInfo = await Promise.all(freeLectures.map(async (lecture) => {
                    const teacherSnapshot = await db.collection('teacher').doc(lecture.teacherId).get();
                    const teacherData = teacherSnapshot.data();
                    console.log("=====>", teacherData);
                    return {
                        ...lecture,
                        teacher: {
                            id: lecture.teacherId,
                            name: teacherData?.fullname,
                        }
                    };
                }));
                console.log(lectureInfo);
                return lectureInfo;
            };
            console.log(docs);
            return await mapToLectureInfo();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default lectureService;