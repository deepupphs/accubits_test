import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { UserInfoEntry } from './dto/user.dto';
import { MongoError } from 'mongodb';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as csvtojson from 'csvtojson'
import { News, NewsDocument } from 'src/schema/news.schema';
import { SERVICES } from 'src/const';
//const csvtojson = require("csvtojson");

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(News.name)
        private newsModel: Model<NewsDocument>,
        // private fileService: FileStorageService,
        @Inject(SERVICES.SVC_EMAIL) private emailSvc: ClientProxy
    ) { }

    async create(
        firstName: string,
        lastName: string,
        email: string,
        age: string,
    ) {
        try {
            const userinfo = new this.userModel();
            userinfo.firstName = firstName;
            userinfo.lastName = lastName;
            userinfo.email = email;
            userinfo.age = age;

            await userinfo.save();
            return new UserInfoEntry({ ...userinfo.toJSON(), userId: userinfo._id });
        } catch (err) {
            if (err instanceof MongoError) {
                if (err.code === 11000)
                    throw new ConflictException('email already in use.');
            }
            throw new RpcException(
                err.error_description || err.message || err.error,
            );
        }
    }

    async uploadfile(file) {
        try {
            const csvfiledata = await csvtojson()
                .fromFile(file.path)
                .then(csvData => {
                    console.log("csvdata", csvData);
                    return csvData;
                })

            const newsdb = await this.newsModel.insertMany(csvfiledata)

            const emailvalue = await csvfiledata.map(v =>v.email)

            console.log(emailvalue)



            let emailMatchregex = {
                email: { $in: emailvalue }
            }

            const data = await this.userModel
                .aggregate([
                    { $match: emailMatchregex },
                    {
                        $lookup: {
                            from: "news",
                            localField: "email",
                            foreignField: "email",
                            as: "newscontent",
                        }
                    },
                    {
                        $unwind: {
                            path: "$newscontent",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            firstName:1,
                            lastName:1,
                            email:1,
                            newsletter_name: "$newscontent.newsletter_name",
                            newsletter_content: "$newscontent.newsletter_content"

                        }
                    }
                ])
            console.log("data", data)
            //return data;

       const val = await this.emailSvc
            .send(
              {
                cmd: 'email-service',
              },
              data,
            )
            .toPromise();
            console.log("val", val)
        } catch (err) {
            throw new RpcException(
                err.error_description || err.message || err.error,
            );
        }
    }
}
