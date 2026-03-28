module Api
  module V1
    class SessionsController < ApplicationController
      def create
        user = User.find_by(email: params[:email])

        if user && user.password == params[:password]
          render json: {
            id:    user.id,
            name:  user.name,
            email: user.email,
            role:  user.role
          }
        else
          render json: { error: "Email ou senha inválidos" }, status: :unauthorized
        end
      end
    end
  end
end