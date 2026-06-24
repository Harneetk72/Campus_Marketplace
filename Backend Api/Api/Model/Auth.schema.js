    import mongoose from "mongoose";
    import bcrypt from "bcrypt";
    const AuthSchema = new mongoose.Schema(
      {
        userName: {
          type: String,
        },

        email: {
          type: String,
          required: true,
          unique: true,
        },

        password: {
          type: String,
          required: true,
        },

        college: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "College",
        },
        role: {
          type: String,
          enum: ["user", "admin"],
          default: "user",
        },
        isVerified: {
          type: Boolean,
          default: true,
        },
        
      },
      {
        timestamps: true,
      },
    );

  AuthSchema.pre("save", async function () {
    try {
          if (!this.isModified("password")) return;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    } catch (error) {
      console.log(error);
    }
  });

  AuthSchema.methods.comparePassword = async function (EnteredPassword) {
    return await bcrypt.compare(EnteredPassword, this.password);
  };
  export const Auth = mongoose.model("Auth", AuthSchema);
