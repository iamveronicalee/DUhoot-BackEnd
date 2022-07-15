import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../MyContext";
import { isAuth } from "../isAuth";
import { sendRefreshToken } from "../sendRefreshToken";
import {
  generateAccessToken,
  generateRefreshAccessToken,
} from "../../routes/auth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `your user name is: ! ${payload!.userName}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User)
  getUser() {
    // let user = authenticateToken(token)

    return User.find();
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("userName", () => String) userName: string,
    @Arg("userId", () => String) userId: string,
    @Arg("binusianId", () => String) binusianId: string
  ) {
    try {
      await User.insert({
        userName,
        userId,
        binusianId,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("userName", () => String) userName: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      throw new Error("could not find user");
    }

    // login successfully
    sendRefreshToken(res, generateRefreshAccessToken(user));

    return {
      accessToken: generateAccessToken(user),
    };
  }
}
