module Api
  module V1
    class CommentsController < ApplicationController

      def index
        bug      = Bug.find(params[:bug_id])
        comments = bug.comments.includes(:user).order(:created_at)
        render json: comments.map { |c| serialize_comment(c) }
      end

      def create
        bug     = Bug.find(params[:bug_id])
        comment = bug.comments.new(comment_params)
        if comment.save
          render json: serialize_comment(comment), status: :created
        else
          render json: { error: "Erro ao criar comentário", fields: comment.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        comment = Comment.find(params[:id])
        comment.destroy
        head :no_content
      end

      private

      def comment_params
        params.require(:comment).permit(:body, :user_id)
      end

      def serialize_comment(comment)
        {
          id:         comment.id,
          body:       comment.body,
          user:       { id: comment.user.id, name: comment.user.name },
          bug_id:     comment.bug_id,
          created_at: comment.created_at
        }
      end
    end
  end
end