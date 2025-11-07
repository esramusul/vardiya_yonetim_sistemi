module Api
  module V1
    class ShiftAssignmentsController < ApplicationController
      before_action :set_shift

      def index
        render json: @shift.employees
      end

      def create
        assignment = @shift.shift_assignments.new(shift_assignment_params)
        if assignment.save
          render json: assignment, status: :created
        else
          render json: { errors: assignment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        assignment = @shift.shift_assignments.find(params[:id])
        assignment.destroy
        head :no_content
      end

      private

      def set_shift
        @shift = Shift.find(params[:shift_id])
      end

      def shift_assignment_params
        params.require(:shift_assignment).permit(:employee_id)
      end
    end
  end
end
