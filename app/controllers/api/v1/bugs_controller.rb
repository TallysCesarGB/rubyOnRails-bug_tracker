module Api
  module V1
    class BugsController < ApplicationController
      before_action :set_bug, only: [:show, :update, :destroy]

      def index
        bugs = Bug.includes(:project, :reporter, :assignee)

        bugs = bugs.where(project_id: params[:project_id]) if params[:project_id].present?
        bugs = bugs.where(status:     params[:status])     if params[:status].present?
        bugs = bugs.where(severity:   params[:severity])   if params[:severity].present?
        bugs = bugs.where(reporter_id: params[:reporter_id]) if params[:reporter_id].present?

        bugs = bugs.order(created_at: :desc)

        render json: {
          data:  bugs.map { |b| serialize_bug(b) },
          meta:  {
            total:       bugs.count,
            open:        bugs.count { |b| b.status == "open" },
            in_progress: bugs.count { |b| b.status == "in_progress" },
            resolved:    bugs.count { |b| b.status == "resolved" },
            closed:      bugs.count { |b| b.status == "closed" }
          }
        }
      end

      def show
        render json: serialize_bug_detail(@bug)
      end

      def create
        bug = Bug.new(bug_params)
        if bug.save
          bug.reload
          render json: serialize_bug(bug), status: :created
        else
          render json: { error: "Erro ao criar bug", fields: bug.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @bug.update(bug_params)
          render json: serialize_bug(@bug)
        else
          render json: { error: "Erro ao atualizar", fields: @bug.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @bug.destroy
        head :no_content
      end

      private

      def set_bug
        @bug = Bug.includes(:project, :reporter, :assignee, comments: :user).find(params[:id])
      end

      def bug_params
        params.require(:bug).permit(
          :title, :description, :severity,
          :status, :project_id, :reporter_id, :assignee_id
        )
      end

      def serialize_bug(bug)
        {
          id:          bug.id,
          title:       bug.title,
          description: bug.description,
          severity:    bug.severity,
          status:      bug.status,
          project:     { id: bug.project.id,  name: bug.project.name },
          reporter:    { id: bug.reporter.id,  name: bug.reporter.name },
          assignee:    bug.assignee ? { id: bug.assignee.id, name: bug.assignee.name } : nil,
          created_at:  bug.created_at,
          updated_at:  bug.updated_at
        }
      end

      def serialize_bug_detail(bug)
        serialize_bug(bug).merge(
          comments: bug.comments.order(:created_at).map { |c| serialize_comment(c) }
        )
      end

      def serialize_comment(comment)
        {
          id:         comment.id,
          body:       comment.body,
          user:       { id: comment.user.id, name: comment.user.name },
          created_at: comment.created_at
        }
      end
    end
  end
end